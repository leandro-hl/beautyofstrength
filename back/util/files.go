// Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package util

import (
	"bufio"
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"os"
	"path/filepath"
)

func CompressImage(img image.Image) *bytes.Buffer {
	// Compress the image by adjusting the quality to reduce the file size
	// Note: Finding the right quality to achieve exactly 30KB might require experimentation
	var quality int = 75 // Start with a quality setting, which may need adjustment
	buf := new(bytes.Buffer)
	for {
		buf.Reset() // Reset buffer for the next try
		err := jpeg.Encode(buf, img, &jpeg.Options{Quality: quality})
		Check(err)

		// Check if the size is close to 30KB
		// This is a simplistic approach; you may need a more sophisticated method to adjust the quality
		if buf.Len() <= 30*1024 { // Check if the file size is less or equal to 30KB
			break // If it's 30KB or less, stop adjusting
		} else {
			quality -= 5 // Decrease quality to reduce file size
			if quality <= 0 {
				panic(fmt.Errorf("could not compress image to the desired size"))
			}
		}
	}

	// Return the buffer containing the compressed image
	return buf
}

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
