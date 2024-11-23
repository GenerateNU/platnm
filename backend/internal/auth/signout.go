package auth

import (
	"fmt"
	"io"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/errs"
)

func SignOut(cfg *config.Supabase, accessToken string) error {
	apiURL := fmt.Sprintf("%s/auth/v1/logout", cfg.URL)
	fmt.Printf("Entered signout: " + apiURL)

	req, err := http.NewRequest("POST", apiURL, nil)
	if err != nil {
		return errs.BadRequest("failed to create request")
	}

	req.Header.Set("authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Set("apikey", cfg.Key)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return errs.BadRequest("failed to execute request")
	}
	defer resp.Body.Close()

	fmt.Printf("here")

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
