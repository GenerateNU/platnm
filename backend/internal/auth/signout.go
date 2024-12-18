package auth

import (
	"fmt"
	"io"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/errs"
)

func SignOut(cfg *config.Supabase, token string) error {
	apiKey := cfg.Key
	apiURL := fmt.Sprintf("%s/auth/v1/logout?scope=global", cfg.URL)
	req, err := http.NewRequest("POST", apiURL, nil)
	if err != nil {
		return errs.BadRequest("failed to create request")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", apiKey)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return errs.BadRequest("failed to execute request")
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return errs.BadRequest("failed to read response body")
	}

	if resp.StatusCode == 401 {
		return errs.Unauthorized() // already signed out
	}

	if resp.StatusCode != 204 {
		return errs.BadRequest(fmt.Sprintf("sign out failed with status %d: %s", resp.StatusCode, body))
	}

	return nil
}
