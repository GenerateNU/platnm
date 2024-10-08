package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"platnm/internal/config"
)

type SignInResponse struct {
	AccessToken  string      `json:"access_token"`
	TokenType    string      `json:"token_type"`
	RefreshToken string      `json:"refresh_token"`
	ExpiresIn    int         `json:"expires_in"`
	User         interface{} `json:"user"`
	Error        interface{} `json:"error"`
}

func GetAuthToken(config *config.Supabase, email string, password string) (string, error) {

	supabaseURL := config.URL
	apiKey := config.Key

	payload := map[string]string{
		"email":    email,
		"password": password,
	}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal payload: %v", err)
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/auth/v1/token?grant_type=password", supabaseURL), bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create HTTP request: %v", err)
	}

	req.Header.Set("apikey", apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make HTTP request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("error: status code %d, body: %s", resp.StatusCode, body)
	}

	var signInResp SignInResponse
	err = json.Unmarshal(body, &signInResp)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal response: %v", err)
	}

	if signInResp.Error != nil {
		return "", fmt.Errorf("error in response: %v", signInResp.Error)
	}

	return signInResp.AccessToken, nil
}
