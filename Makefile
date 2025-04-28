SHELL := /bin/bash
IMAGE_REGISTRY := gitea.dreger.lan/sdreger/lib-manager-react-ts
BUILD_REF = $(shell git rev-parse --short HEAD)
BACKEND_API_URL := https://lib-manager-go.dreger.lan/api
SSL_CERT_FILE := tls-dell-traefik/ca.pem
PACT_DIR := $(PWD)/pacts
PACT_BROKER_PROTO := https
PACT_BROKER_URL := pact-broker.dreger.lan

# docker/build: build the Docker image with api reverse proxy config
.PHONY: docker/build/api-proxy
docker/build/api-proxy:
	docker build -t ${IMAGE_REGISTRY}:${BUILD_REF} -t ${IMAGE_REGISTRY}:latest \
		--target api-proxy -f deploy/docker/Dockerfile .

# docker/build: build the Docker image without api reverse proxy config
.PHONY: docker/build/no-api-proxy
docker/build/no-api-proxy:
	docker build -t ${IMAGE_REGISTRY}:${BUILD_REF} -t ${IMAGE_REGISTRY}:latest \
		--target no-api-proxy -f deploy/docker/Dockerfile .

# docker/run/api-proxy: run the Docker image with api reverse proxy config
.PHONY: docker/run/api-proxy
docker/run/api-proxy:
	docker run --rm --name fe \
		-e API_URL=${BACKEND_API_URL} -p 5173:8080 ${IMAGE_REGISTRY}:latest

# docker/run/api-proxy: run the Docker image without api reverse proxy config
.PHONY: docker/run/no-api-proxy
docker/run/no-api-proxy:
	docker run --rm --name fe -p 5173:8080 ${IMAGE_REGISTRY}:latest

.PHONY: pact/consumer/publish
pact/consumer/publish:
	PACT_DO_NOT_TRACK=true SSL_CERT_FILE=${SSL_CERT_FILE} pact-broker publish \
		--broker-base-url ${PACT_BROKER_PROTO}://${PACT_BROKER_URL} \
		${PACT_DIR} --consumer-app-version=${BUILD_REF} --auto-detect-version-properties
