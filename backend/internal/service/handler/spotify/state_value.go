package spotify

import (
	"errors"
	"sync"
)

const (
	verifierLen  = 43
	challengeLen = 43
	bufferSize   = verifierLen + challengeLen
)

var ErrInvalidStateValueLength = errors.New("invalid state value length")

type stateValue struct {
	verifier  string
	challenge string
}

func (sv *stateValue) MarshalBinary() ([]byte, error) {
	buffer := getBuffer()
	copy(buffer.data[:verifierLen], sv.verifier)
	copy(buffer.data[verifierLen:], sv.challenge)
	return buffer.data, nil
}

// UnmarshalBinary decodes the state value from binary data.
// Returns ErrInvalidStateValueLength if the data length is
// not equal to bufferSize.
func (sv *stateValue) UnmarshalBinary(data []byte) error {
	if len(data) != bufferSize {
		return ErrInvalidStateValueLength
	}
	sv.verifier = string(data[:verifierLen])
	sv.challenge = string(data[verifierLen:])
	putBuffer(&buffer{data: data})
	return nil
}

type buffer struct {
	data []byte
}

var bufferPool = sync.Pool{
	New: func() interface{} {
		return make([]byte, bufferSize)
	},
}

func getBuffer() *buffer {
	return bufferPool.Get().(*buffer)
}

func putBuffer(buffer *buffer) {
	bufferPool.Put(buffer)
}
