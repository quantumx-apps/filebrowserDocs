# Development server
dev:
	hugo server -D

# Build for production
build:
	hugo --minify

# Build for GitHub Pages
build-github:
	hugo --minify --baseURL "https://quantumx-apps.github.io/filebrowserDocs"

# Clean build artifacts
clean:
	rm -rf public/

sync-translations:
	echo translating... not working yet