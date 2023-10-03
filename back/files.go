package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

func SaveImage(relPath string, fileName string, input io.Reader) {
	path, err := filepath.Abs(relPath)
	Check(err)

	output, err := os.Create(fmt.Sprintf("%s/%s", path, fileName))
	Check(err)
	defer output.Close()

	reader := bufio.NewReader(input)
	writer := bufio.NewWriter(output)
	buf := make([]byte, 1024)

	for {
		n, err := reader.Read(buf)

		if ReadFinished(err) {
			break
		}

		Check(err)

		_, err = writer.Write(buf[:n])

		Check(err)
	}

	err = writer.Flush()
	Check(err)
}
