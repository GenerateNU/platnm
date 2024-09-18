package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/url"
	"os"
	"platnm/internal/errs"
	"sync"

	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

var (
	SpotifyAuthURL  = "https://accounts.spotify.com/authorize"
	SpotifyTokenURL = "https://accounts.spotify.com/api/token"
)

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

// this is used to keep track of associated code verifier for each state since code verifier will be needed again to get token
type CodeVerifierStore struct {
	CodeVerifierMap map[string]string
	Mu              sync.Mutex
}

type AuthHandler struct {
	CodeVerifierStore *CodeVerifierStore
}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		CodeVerifierStore: &CodeVerifierStore{
			CodeVerifierMap: make(map[string]string),
			Mu:              sync.Mutex{},
		},
	}
}

func (h *AuthHandler) SpotifyRedirect(c *fiber.Ctx) error {
	verifier := oauth2.GenerateVerifier()
	challenge := oauth2.S256ChallengeFromVerifier(verifier)

	// store state as uuid for now
	state := uuid.NewString()

	h.CodeVerifierStore.Mu.Lock()
	h.CodeVerifierStore.CodeVerifierMap[state] = verifier
	h.CodeVerifierStore.Mu.Unlock()

	params := url.Values{}
	params.Add("client_id", os.Getenv("SPOTIFY_CLIENT_ID"))
	params.Add("response_type", "code")
	params.Add("redirect_uri", os.Getenv("SPOTIFY_REDIRECT_URI"))
	params.Add("state", state)
	params.Add("scope", "user-read-private")
	params.Add("code_challenge_method", "S256")
	params.Add("code_challenge", challenge)

	u, err := url.Parse(SpotifyAuthURL)
	if err != nil {
		return errs.InternalServerError()
	}

	u.RawQuery = params.Encode()

	// remove in future
	fmt.Printf("%s\n", u.String())

	return c.Redirect(u.String())
}

func (h *AuthHandler) SpotifyCallback(c *fiber.Ctx) error {
	if err := c.Query("error"); err != "" {
		// indicates that user denied access
		return errs.Unauthorized()
	}

	code := c.Query("code")
	state := c.Query("state")

	h.CodeVerifierStore.Mu.Lock()
	verifier, ok := h.CodeVerifierStore.CodeVerifierMap[state]
	h.CodeVerifierStore.Mu.Unlock()

	if !ok {
		// indicates that state is different from what was originally stored
		return errs.Unauthorized()
	}

	params := url.Values{}
	params.Add("grant_type", "authorization_code")
	params.Add("code", code)
	params.Add("redirect_uri", os.Getenv("SPOTIFY_REDIRECT_URI"))
	params.Add("client_id", os.Getenv("SPOTIFY_CLIENT_ID"))
	params.Add("code_verifier", verifier)

	req, err := http.NewRequest("POST", SpotifyTokenURL, nil)
	if err != nil {
		return errs.InternalServerError()
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.URL.RawQuery = params.Encode()

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return errs.InternalServerError()
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errs.NewHTTPError(500, errors.New("failed to get token"))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return errs.InternalServerError()
	}

	var tokenResponse TokenResponse
	if err := json.Unmarshal(body, &tokenResponse); err != nil {
		return errs.InternalServerError()
	}

	// remove in future
	fmt.Printf("%+v\n", tokenResponse)

	// do something with tokenResponse

	// redirect to frontend
	return c.Redirect("http://localhost:3000")
}
