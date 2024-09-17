package handler

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"strings"

	spotifyauth "github.com/zmb3/spotify/v2/auth"

	"platnm/internal/config"

	"github.com/gofiber/fiber/v2"
	"github.com/sethvargo/go-envconfig"
	"github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

var (
	redirectURI       = "http://localhost:8080/callback"
	auth              = spotifyauth.New(spotifyauth.WithRedirectURL(redirectURI), spotifyauth.WithScopes(spotifyauth.ScopeUserReadPrivate))
	ch                = make(chan *spotify.Client)
	state             = "abc123"
	codeVerifier, err = generateRandomString(128)
)

func generateRandomString(length int) (string, error) {
	const possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)

	for i := range length {
		index, err := rand.Int(rand.Reader, big.NewInt(int64(len(possible))))
		if err != nil {
			return "", err
		}
		result[i] = possible[index.Int64()]
	}
	return string(result), nil
}

func computeSHA256(plain string) (string, error) {
	hasher := sha256.New()
	_, err := hasher.Write([]byte(plain))
	if err != nil {
		return "", err
	}
	hash := hasher.Sum(nil)
	return hex.EncodeToString(hash), nil
}

func base64Encode(input []byte) string {
	str := base64.StdEncoding.EncodeToString(input)
	str = strings.TrimRight(str, "=")
	str = strings.ReplaceAll(str, "+", "-")
	str = strings.ReplaceAll(str, "/", "_")
	return str
}

func completeAuth(w http.ResponseWriter, r *http.Request) {
	tok, err := auth.Token(r.Context(), state, r,
		oauth2.SetAuthURLParam("code_verifier", codeVerifier))
	if err != nil {
		http.Error(w, "Couldn't get token", http.StatusForbidden)
		log.Fatal(err)
	}
	if st := r.FormValue("state"); st != state {
		http.NotFound(w, r)
		log.Fatalf("State mismatch: %s != %s\n", st, state)
	}
	// use the token to get an authenticated client
	client := spotify.New(auth.Client(r.Context(), tok))
	fmt.Fprintf(w, "Login Completed!")
	ch <- client
}

func configurePKCE() spotify.Client {
	var config config.Config

	if err := envconfig.Process(context.Background(), &config); err != nil {
		log.Fatalln("Error processing .env file: ", err)
	}

	codeChallenge, err := computeSHA256(codeVerifier)
	if err != nil {
		log.Fatalf("couldn't compute SHA256: %v", err)
	}

	codeChallenge = base64Encode([]byte(codeChallenge))
	http.HandleFunc("/callback", completeAuth)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Got request for:", r.URL.String())
	})
	go http.ListenAndServe(":8080", nil)

	url := auth.AuthURL(state,
		oauth2.SetAuthURLParam("client_id", config.SpClientKey),
		oauth2.SetAuthURLParam("code_challenge_method", "S256"),
		oauth2.SetAuthURLParam("code_challenge", codeChallenge),
	)
	fmt.Println("Please log in to Spotify by visiting the following page in your browser:", url)

	// wait for auth to complete
	client := <-ch
	// /callback?code=AQDS_gNUxSbt5vMweZKrafGpw-xj1ZCEWvplmdzSpZoQTsshJ7dG1svBCsTw3KaKKfJGjXHm2-SzGhLCtv32YmqoswwHdHmXX5mqN5jNLV-FdWJ2ELG5T-9SUyLL2V9qnNyn6g9EllF2yBAeUAzfKvPX-NR-SLH_F2nIHl9cdCClOjvarT0BailMZMbC3FAgt71cbkRmMoXX04J5Hcx45afy_XFq7RqvehVC_AqIIYYYJm8MBh2apUjMiodz-k9QfFzefpA4CFFoIC5E2L91yCDFm9SuSQVLeXyNOT7Nd7qLfmBtYI1wnDs1dAJDtEVQiAPK&state=abc123

	return *client
}

func configureClientCreds() spotify.Client {
	var config config.Config

	if err := envconfig.Process(context.Background(), &config); err != nil {
		log.Fatalln("Error processing .env file: ", err)
	}

	ctx := context.Background()
	authConfig := &clientcredentials.Config{
		ClientID:     config.SpClientKey,
		ClientSecret: config.SpClientSecret,
		TokenURL:     spotifyauth.TokenURL,
	}

	accessToken, err := authConfig.Token(context.Background())
	if err != nil {
		log.Fatalf("couldn't get token: %v", err)
	}

	httpClient := spotifyauth.New().Client(ctx, accessToken)
	client := *spotify.New(httpClient)
	return client
}

func GetPlatnmPlaylist(c *fiber.Ctx) error {
	ctx := context.Background()
	client := configurePKCE()

	playlistID := spotify.ID("671uu0Y7jiAgX04Ou82Up9?si=80a629645bb84d42")
	playlist, err := client.GetPlaylist(ctx, playlistID)
	if err != nil {
		log.Fatalf("couldn't get playlist: %v", err)
	}

	return c.Status(fiber.StatusOK).JSON(playlist)
}
