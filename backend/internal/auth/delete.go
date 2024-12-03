package auth

import (
	"fmt"
	"io"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/errs"
)

func DeleteUser(cfg *config.Supabase, userID string) error {
	apiURL := fmt.Sprintf("%s/auth/v1/admin/users/%s", cfg.URL, userID)

	req, err := http.NewRequest("DELETE", apiURL, nil)
	if err != nil {
		return errs.BadRequest("failed to create request")
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", cfg.Key))
	req.Header.Set("apikey", cfg.Key)

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

	if resp.StatusCode != http.StatusOK {
		return errs.BadRequest(fmt.Sprintf("failed to delete user %d: %s", resp.StatusCode, body))
	}

	return nil
}
