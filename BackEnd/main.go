package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"

	"net/http"
	// "reflect"
	// "time"
	// "lukechampine.com/lthash"
	"encoding/binary"
	"io"
	// "unicode/utf8"
	"golang.org/x/crypto/blake2b"
	// "fmt"
	// "golang.org/x/text/encoding"
	// "golang.org/x/text/encoding/charmap"
	"io/ioutil"
	// "os"
	// "unicode/utf8"
)

// import "./lthash"

type Hash interface {
	// Add adds p to the checksum.
	Add(p []byte)
	// Remove removes p from the checksum.
	Remove(p []byte)
	// Sum appends the current checksum to b and returns it.
	Sum(b []byte) []byte
	// SetState sets the current checksum.
	SetState(state []byte)
}

type hash16 struct {
	sum  [64]byte
	hbuf [64]byte
	xof  blake2b.XOF
}

func (h *hash16) hashObject(p []byte) *[64]byte {
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
	xof, _ := blake2b.NewXOF(64, nil)
	return &hash16{xof: xof}
}

func add16(x, y *[64]byte) {
	for i := 0; i < 64; i += 2 {
		xi, yi := x[i:i+2], y[i:i+2]
		sum := binary.LittleEndian.Uint16(xi) + binary.LittleEndian.Uint16(yi)
		binary.LittleEndian.PutUint16(xi, sum)
	}
}

func sub16(x, y *[64]byte) {
	for i := 0; i < 64; i += 2 {
		xi, yi := x[i:i+2], y[i:i+2]
		sum := binary.LittleEndian.Uint16(xi) - binary.LittleEndian.Uint16(yi)
		binary.LittleEndian.PutUint16(xi, sum)
	}
}

type Input struct {
	S1 string `json:"s1"`
	S2 string `json:"s2"`
}

type Output struct {
	CombinedHash string `json:"combinedHash"`
	SingleHash   string `json:"singleHash"`
}

type InputCombineWithHash struct {
	HashS1 string `json:"hashS1"`
	S2     string `json:"s2"`
}

type OutputCombineWithHash struct {
	CombinedHash string `json:"combinedHash"`
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for all routes
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == http.MethodPost {
		var input Input
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Perform computation using lthash package
		hash := New16()
		hash.Add([]byte(input.S1))
		hash.Add([]byte(input.S2))

		combinedHash := string(hash.Sum(nil))

		// Calculate the lthash of a single string
		singleHash := calculateSingleHash("example_string")

		output := Output{
			CombinedHash: combinedHash,
			SingleHash:   singleHash,
		}

		fmt.Println("Combined Hash:", output.CombinedHash)
		fmt.Println("Single Hash:", output.SingleHash)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(output)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func calculateSingleHash(inputString string) string {
	hash := New16()
	hash.Add([]byte(inputString))
	return string(hash.Sum(nil))
}

func handleSingleHashRequest(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for all routes
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == http.MethodPost {
		var input struct {
			SingleString string `json:"s1"`
		}
		fmt.Println("Hash of to be calculated=",input.SingleString)
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Calculate the lthash of the single string
		singleHash := calculateSingleHash(input.SingleString)
		combinedHash := calculateSingleHash("haha")

		output := Output{
			CombinedHash: combinedHash,
			SingleHash:   singleHash,
		}

		fmt.Println("Single Hash:", output.SingleHash)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(output)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
// func decodeToUTF8(encodedString string, enc encoding.Encoding) (string, error) {
// 	decodedBytes, err := enc.NewDecoder().Bytes([]byte(encodedString))
// 	if err != nil {
// 		return "", err
// 	}

// 	decodedString := string(decodedBytes)
// 	return decodedString, nil
// }

// func encodeToUTF8(originalString string, enc encoding.Encoding) (string, error) {
// 	encodedBytes, err := enc.NewEncoder().Bytes([]byte(originalString))
// 	if err != nil {
// 		return "", err
// 	}

// 	encodedString := string(encodedBytes)
// 	return encodedString, nil
// }

func writeToFile(filename, content string) error {
	return ioutil.WriteFile(filename, []byte(content), 0644)
}

func readFromFile(filename string) (string, error) {
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		return "", err
	}
	return string(content), nil
}
func Makehash(inputString1 string,inputString2 string ) string{
		str1 := inputString1
		h:=New16()
		h.Add([]byte("hello"))
		s11:=string(h.Sum(nil))
		hash:=New16()
		str2 := s11
	// str2 := "Hello, World!"


		var validCharacters strings.Builder

	for i, c := range str1 {
		 fmt.Printf("Index %d: Character: %c (Hex: %x, Unicode: %U)\n", i,c , c, c)
	}

	// Get the final concatenated string with valid characters
	resultString := validCharacters.String()
	fmt.Println("Result String:", resultString)
	// 	length:=len(inputString1)
	// fmt.Println("Our length=",length)
		inputString1 = resultString
		hash.SetState([]byte(inputString1))
		fmt.Println("Hereee=",inputString1)
	length:=len(inputString1)
	fmt.Println("Our length=",length)
	length1:=len((s11))
	fmt.Println("Our length=",length1)
	fmt.Println("strings1=",inputString1,"strings2=",s11)
	fmt.Println("String1=",hex.EncodeToString([]byte(inputString1)),"\nstring 2=",hex.EncodeToString([]byte(s11)))
	if(string([]byte(inputString1))==string(h.Sum(nil))){
		fmt.Println("Love day lg gye!")
	}


	for i, c := range str2 {
		fmt.Printf("Character %d: %c (Unicode: %U)\n",i,c,c)
	}
	fmt.Println("Alnkrit here is the answer=",string(hash.Sum(nil)))
	s1:=hash.Sum(nil)
	hash1:=New16()
	hash1.SetState([]byte(s1))
	fmt.Println("Alnkrit here is the answer 111=",string(hash1.Sum(nil)))
	hash.Add([]byte(inputString2))
	return "Yes"
	
}

func handleCombineWithHashRequest(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for all routes
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == http.MethodPost {
		var input InputCombineWithHash
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// fmt.Println("Here is the hashs1=",input.HashS1)
		// fmt.Println("This is s2=",input.S2)
		// fmt.Println("This is type= ",reflect.TypeOf(input.HashS1).Kind())
		

		// Initialize lthash with HashS2
		hashes:=Makehash(input.HashS1,input.S2)
		
		fmt.Println("here Yes",hashes)
		fmt.Printf("Here is the value = %x\n", input.HashS1)

		hash := New16()
		hash.SetState([]byte(input.HashS1))
		s11 := hex.EncodeToString(hash.Sum(nil))
		fmt.Printf("Here is the value = %s\n", s11)
		if(s11==input.HashS1){
			fmt.Println("Yes")
		}
		
		// Combine HashS2 with S1
		// time.Sleep(1 * time.Second)
		// hash.Add([]byte(input.S2))
		//time.Sleep(1 * time.Second)
		//fmt.Println("Here is the hashs1=",input.HashS1)

		// fmt.Println("Here is  s2=",input.S2)
		//fmt.Println("this is the answer=",string(hash.Sum(nil)))
		output := OutputCombineWithHash{
			CombinedHash: string(hash.Sum(nil)),
		}
		
		// fmt.Println("Heheh")
		// fmt.Println("New Combined Hash:", output.CombinedHash)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(output)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
// h12:=""
func main() {
	h:=New16()
	h.Add([]byte("hello"))
	s1:=string(h.Sum(nil))
	// h12=s1
	// fmt.Println("Here is the hash of hello=",s1)
	h.Add([]byte("world"))
	// fmt.Println("Here is the hash of helloworld=",string(h.Sum(nil)))
	a:=New16()
	a.SetState([]byte(s1))
	hashess:=Makehash(s1,"world")
	fmt.Println("Here is my answer",hashess)
	// fmt.Println("Here is the hash of S1=",string(a.Sum(nil)))
	// fmt.Println("To be compared=",string(h.Sum(nil)))
	a.Add([]byte("world"))
	// fmt.Println("Here is the hash of combined=",string(a.Sum(nil)))
	http.HandleFunc("/combine", handleRequest)
	http.HandleFunc("/singlehash", handleSingleHashRequest)
	http.HandleFunc("/combinewithhash", handleCombineWithHashRequest)
	http.ListenAndServe(":8080", nil)
	
}
