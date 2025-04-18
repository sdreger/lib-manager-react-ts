SHELL := /bin/bash
IMAGE_REGISTRY := gitea.dreger.lan/sdreger/lib-manager-react-ts
BUILD_REF = $(shell git rev-parse --short HEAD)
BACKEND_API_URL := https://lib-manager-go.dreger.lan/api

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
