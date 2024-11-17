package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/errs"
)

// ResetPasswordRequest defines the payload for the reset password request
type ResetPasswordRequest struct {
	Password string `json:"password"`
}

// ResetPassword updates the password for a user using the Supabase API
func ResetPassword(cfg *config.Supabase, accessToken, newPassword string) error {
	// Construct the API URL
	apiEndpoint := fmt.Sprintf("%s/auth/v1/user", cfg.URL)

	// Create the request payload
	payload := ResetPasswordRequest{
		Password: newPassword,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return errs.BadRequest("failed to marshal request payload")
	}

	// Create the HTTP PUT request
	req, err := http.NewRequest("PUT", apiEndpoint, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return errs.InternalServerError()
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", cfg.Key)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return errs.InternalServerError()
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return errs.BadRequest("failed to read response body")
	}

	// Check if the request was successful
	if resp.StatusCode != http.StatusOK {
		return errs.BadRequest(fmt.Sprintf("password update failed with status %d: %s", resp.StatusCode, body))
	}

	// If successful, return nil
	return nil
}
