package auth

import (
	"fmt"
	"io"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/errs"
)

// SignOut revokes the user session on Supabase
func SignOut(cfg *config.Supabase, accessToken string) error {
	apiURL := fmt.Sprintf("%s/auth/v1/logout", cfg.URL)

	// Create the HTTP POST request
	req, err := http.NewRequest("POST", apiURL, nil)
	if err != nil {
		return errs.BadRequest("failed to create request")
	}

	// Set headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Set("apikey", cfg.Key)

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return errs.BadRequest("failed to execute request")
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return errs.BadRequest("failed to read response body")
	}

	// Check if the request was successful
	if resp.StatusCode != http.StatusOK {
		return errs.BadRequest(fmt.Sprintf("sign out failed with status %d: %s", resp.StatusCode, body))
	}

	// If successful, return nil
	return nil
}
