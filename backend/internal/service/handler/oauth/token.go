package oauth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"io"
	"sync"

	go_json "github.com/goccy/go-json"

	"golang.org/x/oauth2"
)

const (
	// nonce size is 12 for GCM according to cipher package
	nonceSize int = 12

	// key should be 16 or 32 bytes
	key = "abcdefghijklmnopqrstuvwxyz123456"
)

type nonce struct {
	data []byte
}

var noncePool = sync.Pool{
	New: func() interface{} {
		return &nonce{data: make([]byte, nonceSize)}
	},
}

func getNonce() *nonce {
	return noncePool.Get().(*nonce)
}

func putNonce(n *nonce) {
	noncePool.Put(n)
}

// pointer receiver spotifyauth.Authenticator.Token() returns *oauth2.Token
func EncryptToken(token *oauth2.Token) (string, error) {
	data, err := go_json.Marshal(token)
	if err != nil {
		return "", err
	}

	nonce := getNonce()
	defer putNonce(nonce)

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	if _, err := io.ReadFull(rand.Reader, nonce.data); err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	ciphertext := aesgcm.Seal(nil, nonce.data, data, nil)

	combined := append(nonce.data, ciphertext...)

	return base64.URLEncoding.EncodeToString(combined), nil
}

func DecryptToken(encodedCiphertext string) (oauth2.Token, error) {
	combined, err := base64.URLEncoding.DecodeString(encodedCiphertext)
	if err != nil {
		return oauth2.Token{}, err
	}

	nonce := combined[:nonceSize]
	ciphertext := combined[nonceSize:]

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return oauth2.Token{}, err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return oauth2.Token{}, err
	}

	plaintext, err := aesgcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return oauth2.Token{}, err
	}

	var token oauth2.Token
	if err := go_json.Unmarshal(plaintext, &token); err != nil {
		return oauth2.Token{}, err
	}

	return token, nil
}
