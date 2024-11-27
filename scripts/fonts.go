package main

import (
	"fmt"
	"io/ioutil"
	"os"
	_ "os"
	_ "path/filepath"
	"strings"
)

func main() {
	fontsDir := "ui/src/fonts"

	files, err := ioutil.ReadDir(fontsDir)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return
	}

	var cssContent strings.Builder
	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".ttf") {
			fontName := strings.TrimSuffix(file.Name(), ".ttf")
			buffer := strings.Split(fontName, "-")
			fontStyle := buffer[len(buffer)-2]
			fontWeight := buffer[len(buffer)-1]

			cssContent.WriteString(fmt.Sprintf(`
@font-face {
    font-family: 'Rubik';
    src: url('%s/%s') format('truetype');
    font-weight: %s;
    font-style: %s;
}
`, fontsDir, file.Name(), fontWeight, fontStyle))
		}
	}

	err = os.WriteFile("scripts/rubik.css", []byte(cssContent.String()), 0644)
	if err != nil {
		fmt.Println("Error writing CSS file:", err)
		return
	}

	fmt.Println("rubik.css file generated successfully.")
}
