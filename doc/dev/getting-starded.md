---
title: Getting started as developer
---

## Requirement

* docker & docker-compose
* nodeJS 18
* IDE: VSCode

## Project structure

The git repository host all sub-projects:
* **back** the API part
* **front** the UI part
* **packaging** Docker & Helm chart
* **docs** documentation, as MD files
* **.github** CI stuff with github actions 

A Makefile will help you to run / build all projects.

## Getting started

```
# Run minio, a S3 server, via docker - available on localhost:9000
docker-compose up -d minio

# Run back
make gui/back/run

# Run front
make gui/front/run

# Open front code source
code front
```
