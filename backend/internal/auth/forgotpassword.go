package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/errs"
	"strings"
)

func RecoverPassword(cfg *config.Supabase, email string) error {
	apiURL := fmt.Sprintf("%s/auth/v1/recover", strings.TrimRight(cfg.URL, "/"))
	apiKey := cfg.Key

	fmt.Println("Email: ", apiURL)

	payload := map[string]interface{}{
		"email": email,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return errs.BadRequest("failed to marshal payload")
	}

	fmt.Println("Payload: ", payload)

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return errs.BadRequest("failed to create request")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return errs.BadRequest("failed to execute request")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errs.BadRequest("failed to send forgot password email")
	}

	return nil
}
