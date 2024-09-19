package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
	"sync"
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
