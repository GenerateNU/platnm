package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
	"platnm/internal/constants"
	"sync"

	"github.com/gofiber/storage/memory"
	"github.com/google/uuid"
)

const (
	stateLen   = 64
	bufferSize = stateLen
)

func GenerateState() (string, error) {
	nonceBytes := getBuffer()
	defer putBuffer(nonceBytes)
	if _, err := io.ReadFull(rand.Reader, nonceBytes.data); err != nil {
		return "", fmt.Errorf("source of randomness unavailable: %v", err.Error())
	}
	return base64.URLEncoding.EncodeToString(nonceBytes.data), nil
}

type buffer struct {
	data []byte
}

var bufferPool = sync.Pool{
	New: func() interface{} {
		return &buffer{data: make([]byte, bufferSize)}
	},
}

func getBuffer() *buffer {
	return bufferPool.Get().(*buffer)
}

func putBuffer(buffer *buffer) {
	bufferPool.Put(buffer)
}

type StateStore struct {
	*memory.Storage
}

func NewStateStore(config memory.Config) *StateStore {
	return &StateStore{
		memory.New(),
	}
}

func (s *StateStore) SetUser(state string, id uuid.UUID) error {
	fmt.Printf("state: %s, id: %s\n", state, id)
	if err := s.Set(state, []byte(id.String()), 5*constants.StateDuration); err != nil {
		return err
	}

	return nil
}

func (s *StateStore) GetUser(state string) (uuid.UUID, error) {
	id, err := s.Get(state)
	fmt.Printf("state: %s, id: %s\n", state, id)
	if err != nil {
		return uuid.UUID{}, err
	}

	parsedId, err := uuid.Parse(string(id))
	if err != nil {
		return uuid.UUID{}, err
	}

	return parsedId, nil
}
