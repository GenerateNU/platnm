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

func ResetPassword(cfg *config.Supabase, accessToken, newPassword string) error {
	apiURL := fmt.Sprintf("%s/auth/v1/user", cfg.URL)

	payload := map[string]interface{}{
		"password": newPassword,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return errs.BadRequest("failed to marshal request payload")
	}

	req, err := http.NewRequest("PUT", apiURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return errs.InternalServerError()
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", cfg.Key)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return errs.InternalServerError()
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return errs.BadRequest("failed to read response body")
	}

	if resp.StatusCode != http.StatusOK {
		return errs.BadRequest(fmt.Sprintf("password update failed with status %d: %s", resp.StatusCode, body))
	}

	fmt.Println(resp.Body)

	return nil
}
