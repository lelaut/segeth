package main

import (
	"io/ioutil"
	"net/http"
)

func getFile(r *http.Request) ([]byte, string, error) {
	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	// file, handler, err := r.FormFile("myFile")
	file, h, err := r.FormFile("file")
	if err != nil {
		return nil, "", err
	}
	defer file.Close()
	// fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	// fmt.Printf("File Size: %+v\n", handler.Size)
	// fmt.Printf("MIME Header: %+v\n", handler.Header)

	// read all of the contents of our uploaded file into a
	// byte array
	content, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, "", err
	}

	return content, h.Filename, nil
}
