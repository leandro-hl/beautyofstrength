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
