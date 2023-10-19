package util

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime/debug"
	"strconv"
	"strings"
	"time"
)

func FlagString(name string, value string, usage string) *string {
	var p string
	if flag.Lookup(name) == nil {
		flag.StringVar(&p, name, value, usage)
	}
	return &p
}

func FlagInt(name string, value int, usage string) *int {
	var p int
	if flag.Lookup(name) == nil {
		flag.IntVar(&p, name, value, usage)
	}
	return &p
}

func FlagInt64(name string, value int64, usage string) *int64 {
	var p int64
	if flag.Lookup(name) == nil {
		flag.Int64Var(&p, name, value, usage)
	}
	return &p
}

func FlagBool(name string, value bool, usage string) *bool {
	var p bool
	if flag.Lookup(name) == nil {
		flag.BoolVar(&p, name, value, usage)
	}
	return &p
}

//
//func ProcessPanic(intf interface{}, span ...tracer.Span) {
//	stackTrace := string(debug.Stack())
//	Logger("error", span...).Printf("%v\n%s\n", intf, stackTrace)
//}
//
//func ProcessPanicWithAttributes(intf interface{}, attributes map[string]interface{}, span tracer.Span) {
//	stackTrace := string(debug.Stack())
//	LoggerWithAttributes("error", attributes, span).Printf("%v\n%s\n", intf, stackTrace)
//}
//
//func CatchPanic() {
//	if r := recover(); r != nil {
//		ProcessPanic(r)
//	}
//}

func Unmarshal(bytes []byte, object interface{}) {
	err := json.Unmarshal(bytes, object)
	if err != nil {
		panic(err)
	}
}

func Marshal(object interface{}) []byte {
	bytes, err := json.Marshal(object)
	if err != nil {
		panic(err)
	}
	return bytes
}

func TruncDate(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

func EndOfDay(date time.Time) time.Time {
	y, m, d := date.Date()
	return time.Date(y, m, d, 23, 59, 59, 0, date.Location())
}

func Today() time.Time {
	return TruncDate(time.Now())
}

func FileExists(name string) bool {
	_, err := os.Stat(name)
	if err == nil {
		return true
	} else if os.IsNotExist(err) {
		return false
	} else {
		panic(err)
	}
}

func LoadConfig(path string, config interface{}) {
	abs, err := filepath.Abs(path)
	Check(err)
	bytes, err := os.ReadFile(abs)
	Check(err)
	err = json.Unmarshal(bytes, config)
	Check(err)
}

func ParseInt(s string) int64 {
	i, err := strconv.ParseInt(s, 10, 64)
	Check(err)
	return i
}

func ParseFloat(s string) float64 {
	i, err := strconv.ParseFloat(s, 64)
	Check(err)
	return i
}

func ParseBool(s string) bool {
	b, err := strconv.ParseBool(s)
	Check(err)
	return b
}

func JsonDecode(i interface{}, r io.Reader) interface{} {
	err := json.NewDecoder(r).Decode(i)
	Check(err)
	return i
}

func JsonEncode(i interface{}, w io.Writer) {
	err := json.NewEncoder(w).Encode(i)
	Check(err)
}

func JsonPretty(i interface{}, w io.Writer) {
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "    ")
	err := encoder.Encode(i)
	Check(err)
}

func RoundTo2Dec(value float32) float32 {
	value64 := float64(value)
	return float32(math.Round(value64*100) / 100)
}

func PBool(o bool) *bool {
	return &o
}

func PUint(o uint) *uint {
	return &o
}

func PString(s string) *string {
	return &s
}

func PRune(s rune) *string {
	a := string(s)
	return &a
}

func PStringf(s string, values ...interface{}) *string {
	return PString(fmt.Sprintf(s, values...))
}

func PInt64(i int64) *int64 {
	return &i
}

func PInt(i int) *int {
	return &i
}

func PFloat32(f float32) *float32 {
	return &f
}

func PFloat64(f float64) *float64 {
	return &f
}

func PTime(t time.Time) *time.Time {
	return &t
}

func PJson(b []byte) *json.RawMessage {
	rm := json.RawMessage(b)
	return &rm
}

func XFind(data interface{}, path string) interface{} {
	steps := strings.Split(path, ".")
	current := data
	for _, key := range steps {
		if strings.HasPrefix(key, "#") {
			list := current.([]interface{})
			index := int(ParseInt(key[1:]))
			if index >= len(list) {
				return nil
			} else {
				current = list[index]
			}
		} else {
			object := current.(map[string]interface{})
			value, ok := object[key]
			if ok {
				current = value
			} else {
				return nil
			}
		}
	}
	return current
}

func ValidateExecutable(hash string) {
	current := HashExecutable()
	if current != hash {
		panic("Hash values differ")
	}
	println("Verification succeed.")
}

func HashExecutable() string {
	spec, err := os.Executable()
	Check(err)
	executable, err := os.ReadFile(spec)
	Check(err)
	hasher := sha256.New()
	hasher.Write(executable)
	sum := hasher.Sum(nil)
	return hex.EncodeToString(sum)
}

func RunCmd(name string, args ...string) string {
	cmd := exec.Command(name, args...)
	out, err := cmd.CombinedOutput()
	if err != nil {
		panic(fmt.Sprintf("Failed executing %s with error %v\nCombined output:\n%s\n", cmd.String(), err, string(out)))
	}
	return string(out)
}

func GenerateSessionID() (string, error) {
	// Define the byte length for the session ID.
	// 16 bytes gives us 128 bits of randomness, which should be sufficient for session IDs.
	const sessionIDLength = 16

	randomBytes := make([]byte, sessionIDLength)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", fmt.Errorf("failed to generate random session ID: %v", err)
	}

	// Convert the random bytes to a hexadecimal string for easier handling and storage
	sessionID := hex.EncodeToString(randomBytes)
	return sessionID, nil
}

func UserId(r *http.Request) int64 {
	return r.Context().Value("userId").(int64)
}

func Check(err error) {
	if err != nil {
		fmt.Println(string(debug.Stack()))
		panic(err)
	}
}

func CheckNoPanic(err error) {
	if err != nil {
		fmt.Println(string(debug.Stack()))
		fmt.Println(err)
	}
}
