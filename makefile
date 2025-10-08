# Development server
dev:
	hugo server -D --baseURL "http://localhost:1313/"

# Build for production
build:
	hugo --minify

# Build for GitHub Pages
build-github:
	hugo --minify

# Clean build artifacts
clean:
	rm -rf dist/

sync-translations:
	echo translating... not working yet