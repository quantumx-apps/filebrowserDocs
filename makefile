# Development server
dev:
	hugo server -D --bind 0.0.0.0 --baseURL "http://localhost:1313/" --port 1313

# Build for production
build:
	hugo --minify

# Build for GitHub Pages
build-github:
	hugo --minify

# Clean build artifacts
clean:
	rm -rf dist/

# Translation workflows (requires DEEPL_API_KEY environment variable)
translate:
	@echo "Syncing translations with DeepL..."
	@if [ -z "$$DEEPL_API_KEY" ]; then \
		echo "❌ DEEPL_API_KEY not set. Export it first:"; \
		echo "   export DEEPL_API_KEY=your-api-key"; \
		exit 1; \
	fi
	npm run translate

translate-check:
	@echo "Checking translation status (no API calls)..."
	npm run translate:check

translate-content:
	@echo "Translating content files..."
	@if [ -z "$$DEEPL_API_KEY" ]; then \
		echo "❌ DEEPL_API_KEY not set"; \
		exit 1; \
	fi
	npm run translate:content

translate-i18n:
	@echo "Translating i18n strings..."
	@if [ -z "$$DEEPL_API_KEY" ]; then \
		echo "❌ DEEPL_API_KEY not set"; \
		exit 1; \
	fi
	npm run translate:i18n

# Doclink conversion (relative links <-> doclink shortcodes)
doclinks-convert:
	@echo "Converting relative links to doclink shortcodes..."
	npm run doclinks:convert

doclinks-check:
	@echo "Checking doclinks without modifying files..."
	npm run doclinks:check

doclinks-revert:
	@echo "Reverting doclink shortcodes to relative links..."
	npm run doclinks:revert

# Hugo validation checks (no external dependencies except yq)
validate-frontmatter:
	@echo "Validating YAML front matter..."
	@command -v yq >/dev/null 2>&1 || { echo "Please install yq: brew install yq (macOS) or see https://github.com/mikefarah/yq"; exit 1; }
	@find content -name "*.md" -type f | while read file; do \
		awk '/^---$$/ {flag++; next} flag==1' "$$file" | yq e '.' - > /dev/null 2>&1 || { \
			echo "❌ Invalid front matter in: $$file"; \
			exit 1; \
		}; \
	done
	@echo "✅ All front matter is valid YAML"

hugo-audit:
	@echo "Building Hugo with audit flags..."
	@HUGO_MINIFY_TDEWOLFF_HTML_KEEPCOMMENTS=true \
		HUGO_ENABLEMISSINGTRANSLATIONPLACEHOLDERS=true \
		hugo --minify --baseURL "https://filebrowserquantum.com/"
	@echo "Checking for Hugo-specific issues..."
	@if grep -rn "raw HTML omitted" dist/ 2>/dev/null; then \
		echo "⚠️  Warning: Found 'raw HTML omitted' - check your markdown"; \
	fi
	@if grep -rn "ZgotmplZ" dist/ 2>/dev/null; then \
		echo "❌ Error: Found 'ZgotmplZ' - template execution error"; \
		exit 1; \
	fi
	@if grep -rn "\[i18n\]" dist/ 2>/dev/null; then \
		echo "⚠️  Warning: Found missing translations"; \
	fi
	@if grep -rn "<nil>" dist/ 2>/dev/null; then \
		echo "❌ Error: Found nil pointer references"; \
		exit 1; \
	fi
	@echo "✅ Hugo audit complete"

build-strict:
	@echo "Building Hugo with strict validation flags..."
	hugo \
		--minify \
		--baseURL "https://filebrowserquantum.com/" \
		--printPathWarnings \
		--printUnusedTemplates \
		--templateMetrics \
		--templateMetricsHints

# Run all Hugo quality checks (no external dependencies needed!)
check-all: validate-frontmatter build-strict hugo-audit
	@echo "✅ All Hugo validation checks passed!"

# Install all dependencies
setup:
	@echo "Setting up development environment..."
	@echo ""
	@echo "📦 Installing npm dependencies..."
	npm install
	@echo "installinng hugo"
	CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest
	@if command -v yq >/dev/null 2>&1; then \
		echo "✅ yq is already installed"; \
		yq --version; \
	else \
		echo "⚠️  yq not found - needed for YAML validation"; \
		echo "  macOS: brew install yq"; \
		echo "  Linux: wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 && chmod +x /usr/local/bin/yq"; \
		echo "  Or visit: https://github.com/mikefarah/yq#install"; \
	fi
	@echo ""
	@echo "ℹ️  Note: Hugo validation uses built-in features - no Ruby dependencies needed!"
	@echo "✅ Setup complete!"

# Show available commands
help:
	@echo "FileBrowser Quantum Documentation - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start Hugo development server"
	@echo "  make build            - Build production site"
	@echo "  make clean            - Remove build artifacts"
	@echo ""
	@echo "Validation:"
	@echo "  make validate-frontmatter - Validate YAML front matter"
	@echo "  make build-strict         - Build with strict validation"
	@echo "  make hugo-audit           - Check for Hugo-specific issues"
	@echo "  make check-all            - Run all validation checks"
	@echo ""
	@echo "Translation (requires DEEPL_API_KEY):"
	@echo "  make translate            - Sync all translations"
	@echo "  make translate-check      - Check translation status"
	@echo "  make translate-content    - Translate content files only"
	@echo "  make translate-i18n       - Translate i18n strings only"
	@echo ""
	@echo "Doclinks:"
	@echo "  make doclinks-convert - Convert relative links to doclink shortcodes"
	@echo "  make doclinks-check   - Check doclinks without modifying"
	@echo "  make doclinks-revert  - Revert doclinks to relative links"
	@echo ""
	@echo "Setup:"
	@echo "  make setup            - Install all dependencies"
	@echo "  make help             - Show this help message"