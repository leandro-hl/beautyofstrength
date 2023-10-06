package util

import (
	"fmt"
	"runtime/debug"
)

func PBool(o bool) *bool {
	return &o
}

func PUint(o uint) *uint {
	return &o
}

func Check(err error) {
	if err != nil {
		fmt.Println(debug.Stack())
		panic(err)
	}
}
