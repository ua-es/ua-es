.PHONY: help install build test format watch serve dev

PORT ?= 8000

help:
	@printf "Available targets:\n"
	@printf "  make install  Install exact npm dependencies from package-lock.json\n"
	@printf "  make build    Generate minified JavaScript and CSS assets\n"
	@printf "  make test     Run unit and browser end-to-end tests\n"
	@printf "  make format   Format source JavaScript, CSS, and translations\n"
	@printf "  make watch    Rebuild assets when source files change\n"
	@printf "  make serve    Serve the site at http://localhost:$(PORT)/\n"
	@printf "  make dev      Test, build, watch source, and serve the site\n"

node_modules/.package-lock.json: package.json package-lock.json
	npm ci

install: node_modules/.package-lock.json

build: install
	npm run build

test: install
	npm test

format: install
	npm run format

watch: install
	npm run watch

serve:
	python3 -m http.server $(PORT)

dev: install
	@npm test
	@npm run watch & watcher=$$!; \
	python3 -m http.server $(PORT) & server=$$!; \
	trap 'kill $$watcher $$server 2>/dev/null || true' INT TERM EXIT; \
	printf "Watching source and serving http://localhost:$(PORT)/ (Ctrl-C to stop)\n"; \
	wait
