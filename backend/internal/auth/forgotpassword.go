package auth

import (
	"bytes"
	// "context"
	"encoding/json"
	"net/http"
	"platnm/internal/config"
	"platnm/internal/errs"
	"fmt"
)

func SendForgotPasswordEmail(cfg *config.Supabase, redirectTo string, email string) error {
	apiURL := fmt.Sprintf(cfg.URL, "/auth/v1/recover")
	apiKey := cfg.Key

	fmt.Println("Email: ", email)

	payload := map[string]interface{}{
		"email": email,
		"options": map[string]string{
			"redirectTo": redirectTo,
		},
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
