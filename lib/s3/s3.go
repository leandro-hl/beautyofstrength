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

package ls3

import (
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Config struct {
	AccessKey      *string `json:"accessKey"`
	SecretKey      *string `json:"secretKey"`
	Region         *string `json:"region"`
	Endpoint       *string `json:"endpoint"`
	MainBucketName *string `json:"mainBucketName"`
}

func NewClient(c S3Config) *s3.Client {
	// Create S3 service client
	return s3.NewFromConfig(aws.Config{
		Region:       *c.Region,
		BaseEndpoint: c.Endpoint,
		Credentials:  credentials.NewStaticCredentialsProvider(*c.AccessKey, *c.SecretKey, ""),
	})
}

func NewPresignClient(c S3Config) *s3.PresignClient {
	return s3.NewPresignClient(NewClient(c))
}
