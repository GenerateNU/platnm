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
	Verifier  string
	Challenge string
}

func (sv *stateValue) MarshalBinary() ([]byte, error) {
	buffer := getBuffer()
	copy(buffer[:verifierLen], sv.Verifier)
	copy(buffer[verifierLen:], sv.Challenge)
	return buffer, nil
}

// UnmarshalBinary decodes the state value from binary data.
// Returns ErrInvalidStateValueLength if the data length is
// not equal to bufferSize.
func (sv *stateValue) UnmarshalBinary(data []byte) error {
	if len(data) != bufferSize {
		return ErrInvalidStateValueLength
	}
	sv.Verifier = string(data[:verifierLen])
	sv.Challenge = string(data[verifierLen:])
	putBuffer(data)
	return nil
}

var bufferPool = sync.Pool{
	New: func() interface{} {
		return make([]byte, bufferSize)
	},
}

func getBuffer() []byte {
	return bufferPool.Get().([]byte)
}

func putBuffer(buffer []byte) {
	bufferPool.Put(buffer)
}
