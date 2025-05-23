SHELL := /bin/bash
IMAGE_REGISTRY := gitea.dreger.lan/sdreger/lib-manager-react-ts
BUILD_REF = $(shell git rev-parse --short HEAD)
BACKEND_API_URL := https://lib-manager-go.dreger.lan/api
SSL_CERT_FILE := tls-dell-traefik/ca.pem
PACT_CONSUMER_NAME = lib-manager-react-ts
PACT_DIR := $(PWD)/pacts
PACT_BROKER_URL := pact-broker.dreger.lan
PACT_VERSION_COMMIT := ${shell git describe --tags --abbrev=0}
PACT_VERSION_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

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
	@echo "--- 📝 Publishing Pacts"
	PACT_DO_NOT_TRACK=true SSL_CERT_FILE=${SSL_CERT_FILE} pact-broker publish \
		--broker-base-url ${PACT_BROKER_URL} ${PACT_DIR} \
		--branch=${PACT_VERSION_BRANCH} --consumer-app-version=${PACT_VERSION_COMMIT} \
		--auto-detect-version-properties

.PHONY: pact/consumer/record-deploy
pact/consumer/record-deploy:
	@echo "--- ✅ Recording deployment of consumer"
	PACT_DO_NOT_TRACK=true SSL_CERT_FILE=${SSL_CERT_FILE} pact-broker record-deployment \
		--pacticipant $(PACT_CONSUMER_NAME) --version ${PACT_VERSION_COMMIT} \
		--broker-base-url $(PACT_BROKER_URL) --environment production

.PHONY: pact/consumer/can-i-deploy
pact/consumer/can-i-deploy:
	@echo "--- ✅ Checking if we can deploy consumer"
	PACT_DO_NOT_TRACK=true SSL_CERT_FILE=${SSL_CERT_FILE} pact-broker can-i-deploy \
		--broker-base-url https://pact-broker.dreger.lan --pacticipant ${PACT_CONSUMER_NAME} \
		--version ${PACT_VERSION_COMMIT} --to-environment production

.PHONY: pact/consumer/describe-pacticipant
pact/consumer/describe-pacticipant:
	@echo "--- ✅ Describing a pacticipant"
	PACT_DO_NOT_TRACK=true SSL_CERT_FILE=${SSL_CERT_FILE} pact-broker describe-pacticipant \
    	--broker-base-url https://pact-broker.dreger.lan --name ${PACT_CONSUMER_NAME}

.PHONY: pact/consumer/describe-pacticipant-version
pact/consumer/describe-pacticipant-version:
	@echo "--- ✅ Describing a pacticipant version"
	PACT_DO_NOT_TRACK=true SSL_CERT_FILE=${SSL_CERT_FILE} pact-broker describe-version \
    	--broker-base-url https://pact-broker.dreger.lan --pacticipant ${PACT_CONSUMER_NAME}

# TODO: https://hub.docker.com/r/pactfoundation/pact-cli
