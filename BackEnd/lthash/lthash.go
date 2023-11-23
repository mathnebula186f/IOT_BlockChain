package lthash

import (
	"encoding/binary"
	"io"

	"golang.org/x/crypto/blake2b"
)

// A Hash is an instance of LtHash.
type Hash interface {
	Add(p []byte)
	Remove(p []byte)
	Sum(b []byte) []byte
	SetState(state []byte)
}

type hash16 struct {
	sum  [256]byte // Reduce the size of the hash
	hbuf [256]byte // Reduce the size of the hash
	xof  blake2b.XOF
}

func (h *hash16) hashObject(p []byte) *[256]byte {
	h.xof.Reset()
	h.xof.Write(p)
	_, err := io.ReadFull(h.xof, h.hbuf[:])
	if err != nil {
		panic(err)
	}
	return &h.hbuf
}

// Add implements Hash.
func (h *hash16) Add(p []byte) {
	add16(&h.sum, h.hashObject(p))
}

// Remove implements Hash.
func (h *hash16) Remove(p []byte) {
	sub16(&h.sum, h.hashObject(p))
}

// Sum implements Hash.
func (h *hash16) Sum(b []byte) []byte {
	return append(b, h.sum[:]...)
}

// SetState implements Hash.
func (h *hash16) SetState(state []byte) {
	for i := range &h.sum {
		h.sum[i] = 0
	}
	copy(h.sum[:], state)
}

// New16 returns an instance of lthash16.
func New16() Hash {
	xof, _ := blake2b.NewXOF(256, nil) // Reduce the size of the hash
	return &hash16{xof: xof}
}

func add16(x, y *[256]byte) {
	for i := 0; i < 256; i += 2 {
		xi, yi := x[i:i+2], y[i:i+2]
		sum := binary.LittleEndian.Uint16(xi) + binary.LittleEndian.Uint16(yi)
		binary.LittleEndian.PutUint16(xi, sum)
	}
}

func sub16(x, y *[256]byte) {
	for i := 0; i < 256; i += 2 {
		xi, yi := x[i:i+2], y[i:i+2]
		sum := binary.LittleEndian.Uint16(xi) - binary.LittleEndian.Uint16(yi)
		binary.LittleEndian.PutUint16(xi, sum)
	}
}
