.ONESHELL:
.POSIX:

.DEFAULT_GOAL := run

ELECTRON := $(shell \
	if [ -f /etc/os-release ] && grep -q '^ID=nixos' /etc/os-release; then \
		echo electron; \
	else \
		echo "npx electron"; \
	fi)

node_modules: package-lock.json
	npm install

.PHONY: run
run:
	LOCAL_DOMAIN=1 $(ELECTRON) src/main.js

.PHONY: run-x
run-x:
	LOCAL_DOMAIN=1 ./util/run-xorg $(ELECTRON)

.PHONY: run-wl
run-wl:
	LOCAL_DOMAIN=1 ./util/run-wl $(ELECTRON)

.PHONY: fix
fix: node_modules
	./node_modules/.bin/prettier --write src
