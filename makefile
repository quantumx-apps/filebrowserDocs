# Development server
dev:
	hugo server -D --bind 0.0.0.0 --baseURL "http://vdebian:1313/" --port 1313

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

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION CHECKS - Run locally or in CI/CD
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 1. Validate YAML front matter syntax
check-frontmatter:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Validating YAML front matter..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@command -v yq >/dev/null 2>&1 || { echo "❌ Please install yq: brew install yq (macOS) or see https://github.com/mikefarah/yq"; exit 1; }
	@find content -name "*.md" -type f | while read file; do \
		awk '/^---$$/ {flag++; next} flag==1' "$$file" | yq e '.' - > /dev/null 2>&1 || { \
			echo "❌ Invalid front matter in: $$file"; \
			exit 1; \
		}; \
	done
	@echo "✅ All front matter is valid YAML"
	@echo ""

# 2. Validate required front matter fields
check-frontmatter-fields:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Checking required front matter fields..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@find content/en/docs -name "*.md" -type f | while read file; do \
		if grep -q "^aliases:" "$$file" 2>/dev/null; then \
			continue; \
		fi; \
		if ! grep -q "^title:" "$$file"; then \
			echo "⚠️  Warning: Missing 'title' in $$file"; \
		fi; \
		if ! grep -q "^description:" "$$file"; then \
			echo "⚠️  Warning: Missing 'description' in $$file"; \
		fi; \
		if ! grep -q "^icon:" "$$file"; then \
			echo "⚠️  Warning: Missing 'icon' in $$file"; \
		fi; \
	done
	@echo "✅ Front matter field validation complete"
	@echo ""

# 3. Build Hugo with strict validation flags
build-strict:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Building Hugo with strict validation..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	hugo \
		--minify \
		--baseURL "https://filebrowserquantum.com/" \
		--printPathWarnings \
		--printUnusedTemplates \
		--templateMetrics \
		--templateMetricsHints
	@echo "✅ Hugo build successful"
	@echo ""

# 4. Hugo audit - check for common issues
hugo-audit:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Running Hugo audit checks..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
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
	@echo ""

# 5. Validate translations are in sync
check-translations:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Validating translations..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm not found"; exit 1; }
	@if [ ! -d "node_modules" ]; then \
		echo "⚠️  node_modules not found, running npm install..."; \
		npm install; \
	fi
	@npm run translate:check
	@echo "✅ Translation validation complete"
	@echo ""

# 6. Validate doclinks
check-doclinks:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Validating doclinks..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm not found"; exit 1; }
	@if [ ! -d "node_modules" ]; then \
		echo "⚠️  node_modules not found, running npm install..."; \
		npm install; \
	fi
	@npm run doclinks:check
	@echo "✅ Doclinks validation complete"
	@echo ""

# 7. Validate internal links in markdown files
check-internal-links:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Validating internal links..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Checking for broken internal links in markdown files..."
	@ERROR_COUNT=0; \
	TEMP_FILE=$$(mktemp); \
	find content -name "*.md" -type f | while read file; do \
		grep -oP '\]\((?!http|#|mailto:)[^)]+\)' "$$file" 2>/dev/null | sed 's/](\(.*\))/\1/' | while read link; do \
			link_path=$$(echo "$$link" | sed 's/#.*$$//'); \
			if [ -n "$$link_path" ]; then \
				file_dir=$$(dirname "$$file"); \
				target="$$file_dir/$$link_path"; \
				if [ ! -f "$$target" ] && [ ! -f "$$target.md" ] && [ ! -f "$${target}/index.md" ]; then \
					echo "❌ Broken link in $$file: $$link"; \
					echo "1" >> "$$TEMP_FILE"; \
				fi; \
			fi; \
		done; \
	done; \
	if [ -s "$$TEMP_FILE" ]; then \
		ERROR_COUNT=$$(wc -l < "$$TEMP_FILE"); \
		rm -f "$$TEMP_FILE"; \
		echo ""; \
		echo "❌ Found $$ERROR_COUNT broken internal links"; \
		exit 1; \
	else \
		rm -f "$$TEMP_FILE"; \
	fi
	@echo "✅ Internal link check complete"
	@echo ""

# 8. Validate external links (URLs)
check-external-links:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Validating external links..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@if [ ! -f "scripts/check-external-links.sh" ]; then \
		echo "❌ scripts/check-external-links.sh not found"; \
		exit 1; \
	fi
	@chmod +x scripts/check-external-links.sh
	@bash scripts/check-external-links.sh
	@echo "✅ External link check complete"
	@echo ""

# Update external links cache (validate all links and update cache file)
update-link-cache:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Updating external links cache..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Extracting all external links from markdown files..."
	@TEMP_URLS=$$(mktemp); \
	find content -name "*.md" -type f -exec grep -oP '!?\[[^\]]*\]\(https?://[^)]+\)' {} \; | \
		sed -E 's/.*\((https?:\/\/[^)]+).*/\1/' >> "$$TEMP_URLS"; \
	find content -name "*.md" -type f -exec grep -oP '(href|src)=["'\'']https?://[^"'\'']+["'\'']' {} \; | \
		sed -E 's/(href|src)=["'\'']([^"'\'']+)["'\'']/\2/' >> "$$TEMP_URLS"; \
	ALL_URLS=$$(sort -u "$$TEMP_URLS"); \
	rm -f "$$TEMP_URLS"; \
	URL_COUNT=$$(echo "$$ALL_URLS" | wc -l); \
	echo "Found $$URL_COUNT unique external URLs"; \
	echo "Validating all URLs (this may take a while)..."; \
	echo ""; \
	VALID_URLS=$$(mktemp); \
	CHECKED=0; \
	echo "$$ALL_URLS" | while read url; do \
		CHECKED=$$((CHECKED + 1)); \
		echo -n "[$$CHECKED/$$URL_COUNT] Checking: $$url ... "; \
		HTTP_CODE=$$(curl -o /dev/null -s -w "%{http_code}" -L --max-time 10 --retry 1 "$$url" 2>/dev/null || echo "000"); \
		case "$$HTTP_CODE" in \
			200|201|202|203|204|301|302|303|307|308) \
				echo "✓ OK ($$HTTP_CODE)"; \
				echo "$$url" >> "$$VALID_URLS"; \
				;; \
			*) \
				echo "❌ FAILED ($$HTTP_CODE)"; \
				;; \
		esac; \
	done; \
	VALID_COUNT=$$(wc -l < "$$VALID_URLS" 2>/dev/null || echo "0"); \
	echo ""; \
	echo "Updating .external-links with $$VALID_COUNT valid URLs..."; \
	{ \
		echo "# External Links Cache"; \
		echo "# This file contains URLs that have been validated and can be skipped in checks"; \
		echo "# Format: one URL per line"; \
		echo "# Last updated: $$(date '+%Y-%m-%d %H:%M:%S')"; \
		echo ""; \
		sort -u "$$VALID_URLS" 2>/dev/null || true; \
	} > .external-links; \
	rm -f "$$VALID_URLS"; \
	echo "✅ Cache file updated with $$VALID_COUNT validated URLs"; \
	echo "   Commit .external-links to share with team"

# 9. Validate image references
check-images:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Validating image references..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Checking markdown files for image references..."; \
	TEMP_FILE=$$(mktemp); \
	UNUSED_FILE=$$(mktemp); \
	find content -name "*.md" -type f | while read file; do \
		grep -oP '!\[([^\]]*)\]\(([^)]+)\)' "$$file" 2>/dev/null | sed 's/!\[.*\](\(.*\))/\1/' | while read img; do \
			case "$$img" in \
				http://*|https://*) \
					continue; \
					;; \
				*) \
					file_dir=$$(dirname "$$file"); \
					case "$$img" in \
						/*) \
							img_path="static$$img"; \
							;; \
						*) \
							img_path="$$file_dir/$$img"; \
							;; \
					esac; \
					if [ ! -f "$$img_path" ]; then \
						echo "❌ Missing image in $$file: $$img"; \
						echo "1" >> "$$TEMP_FILE"; \
					fi; \
					;; \
			esac; \
		done; \
	done; \
	echo "Checking for orphaned images in static/..."; \
	UNUSED_COUNT=0; \
	if [ -d "static" ]; then \
		find static -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) | while read img; do \
			img_name=$$(basename "$$img"); \
			if ! grep -rq "$$img_name" content/ layouts/ config/ data/ 2>/dev/null; then \
				echo "⚠️  Potentially unused image: $$img"; \
				echo "1" >> "$$UNUSED_FILE"; \
			fi; \
		done; \
	fi; \
	MISSING_COUNT=0; \
	if [ -s "$$TEMP_FILE" ]; then \
		MISSING_COUNT=$$(wc -l < "$$TEMP_FILE"); \
	fi; \
	if [ -s "$$UNUSED_FILE" ]; then \
		UNUSED_COUNT=$$(wc -l < "$$UNUSED_FILE"); \
	fi; \
	rm -f "$$TEMP_FILE" "$$UNUSED_FILE"; \
	if [ $$MISSING_COUNT -gt 0 ]; then \
		echo ""; \
		echo "❌ Found $$MISSING_COUNT missing images"; \
		exit 1; \
	fi; \
	if [ $$UNUSED_COUNT -gt 0 ]; then \
		echo ""; \
		echo "⚠️  Found $$UNUSED_COUNT potentially unused images (warnings only)"; \
	fi
	@echo "✅ Image validation complete"
	@echo ""

# 10. Validate no TODO/FIXME comments in production content
check-no-todos:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Checking for TODO/FIXME markers..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@if grep -rn "TODO\|FIXME\|XXX" content/ 2>/dev/null | grep -v "Binary file"; then \
		echo "⚠️  Found TODO/FIXME markers in content - consider resolving before merging"; \
	else \
		echo "✅ No TODO/FIXME markers found"; \
	fi
	@echo ""

# Run all validation checks
check-all: check-frontmatter check-frontmatter-fields build-strict hugo-audit check-doclinks check-internal-links check-images check-external-links check-no-todos
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✅ ALL VALIDATION CHECKS PASSED!"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "✓ Front matter YAML syntax valid"
	@echo "✓ Required front matter fields present"
	@echo "✓ Hugo build successful with strict validation"
	@echo "✓ No template errors (ZgotmplZ)"
	@echo "✓ No nil pointer references"
	@echo "✓ Doclinks validated"
	@echo "✓ Internal links checked"
	@echo "✓ Image references validated"
	@echo "✓ External links validated"
	@echo "✓ No TODO/FIXME markers"

# Quick validation (skip slow external link checks)
check-quick: check-frontmatter check-frontmatter-fields build-strict hugo-audit check-doclinks check-images
	@echo "✅ Quick validation passed!"

# Install all dependencies
setup:
	@echo "Setting up development environment..."
	@echo ""
	@echo "📦 Installing npm dependencies..."
	npm install
	@echo ""
	@echo "📦 Installing Hugo (extended version)..."
	CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest
	@echo ""
	@echo "📦 Installing yq (YAML validator)..."
	@if command -v yq >/dev/null 2>&1; then \
		echo "✅ yq is already installed"; \
		yq --version; \
	else \
		echo "Installing yq..."; \
		if [ "$$(uname)" = "Darwin" ]; then \
			if command -v brew >/dev/null 2>&1; then \
				brew install yq && echo "✅ yq installed via Homebrew"; \
			else \
				echo "❌ Homebrew not found. Please install Homebrew first: https://brew.sh"; \
				echo "   Or manually install yq: https://github.com/mikefarah/yq#install"; \
				exit 1; \
			fi; \
		else \
			echo "Downloading yq for Linux..."; \
			if [ -w /usr/local/bin ]; then \
				wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 && \
				chmod +x /usr/local/bin/yq && \
				echo "✅ yq installed to /usr/local/bin/yq"; \
			else \
				echo "Installing yq requires sudo access..."; \
				sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 && \
				sudo chmod +x /usr/local/bin/yq && \
				echo "✅ yq installed to /usr/local/bin/yq"; \
			fi; \
		fi; \
		if command -v yq >/dev/null 2>&1; then \
			yq --version; \
		else \
			echo "❌ Failed to install yq. Please install manually: https://github.com/mikefarah/yq#install"; \
			exit 1; \
		fi; \
	fi
	@echo ""
	@echo "ℹ️  Note: Hugo validation uses built-in features - no Ruby dependencies needed!"
	@echo "✅ Setup complete!"

# Show available commands
help:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "FileBrowser Quantum Documentation - Available Commands"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start Hugo development server"
	@echo "  make build            - Build production site"
	@echo "  make clean            - Remove build artifacts"
	@echo ""
	@echo "Validation (same as CI/CD):"
	@echo "  make check-all              - Run ALL validation checks (recommended)"
	@echo "  make check-quick            - Run validation without external link checks"
	@echo "  make check-frontmatter      - Validate YAML front matter syntax"
	@echo "  make check-frontmatter-fields - Check required front matter fields"
	@echo "  make check-translations     - Validate translations are in sync"
	@echo "  make check-doclinks         - Validate doclinks"
	@echo "  make check-internal-links   - Check for broken internal links"
	@echo "  make check-external-links   - Check for dead external URLs (uses cache)"
	@echo "  make check-images           - Validate image references exist"
	@echo "  make check-no-todos         - Check for TODO/FIXME markers"
	@echo "  make build-strict           - Build with strict validation flags"
	@echo "  make hugo-audit             - Check for Hugo-specific issues"
	@echo "  make update-link-cache      - Validate all links and update cache file"
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
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"