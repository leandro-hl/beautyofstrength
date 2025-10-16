# Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Step 1: Build Go application
FROM golang:1.20 AS go-builder

WORKDIR /beautyofstrenght

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies.
RUN go mod download

# Copy the source code from the current directory to the Working Directory inside the container
COPY . ./

WORKDIR /beautyofstrenght/back/web

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o main .

# Step 2: Build React application
FROM node:14 AS react-builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY ui/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY ui/ ./

# Build the React application
RUN npm run build

# Step 3: Generate final image
FROM alpine

WORKDIR /root/
RUN apk --no-cache add ca-certificates
COPY --from=go-builder /beautyofstrenght/back/web/main /usr/local/bin/
COPY --from=go-builder /beautyofstrenght/img /root/img
COPY --from=react-builder /app/build/ /root/ui/build
CMD ["main"]
