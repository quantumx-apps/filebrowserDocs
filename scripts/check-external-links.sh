#!/bin/bash
# Check external links in markdown files

set -e

# Files to exclude from link checking.
# For example the changelog files that contain lot of GitHub links which get rate-limited after a short time.
EXCLUDE_FILES=(
    "content/en/docs/changelog/stable.md"
    "content/en/docs/changelog/beta.md"
)

# Cache file location
CACHE_FILE=".external-links"
REFRESH_CACHE=0

if [[ "${1:-}" == "--refresh-cache" ]]; then
    REFRESH_CACHE=1
fi

echo "Extracting external links from markdown files..."

# Create temp files
TEMP_URLS=$(mktemp)
URL_MAP=$(mktemp)

# Fast function to strip code blocks using awk (much faster than line-by-line)
strip_code_blocks() {
    awk '
    /^```/ || /^~~~/ {
        in_fence = !in_fence
        next
    }
    /<pre>/ || /<code>/ {
        in_html = 1
        next
    }
    /<\/pre>/ || /<\/code>/ {
        in_html = 0
        next
    }
    /^    / {
        next
    }
    !in_fence && !in_html {
        # Remove inline code
        gsub(/`[^`]*`/, "")
        print
    }
    ' "$1"
}

extract_urls_from_file() {
    local file="$1"
    local cleaned="$2"

    # Markdown links: [text](url) or ![alt](url)
    grep -n -oE '!?\[[^]]*\]\(https?://[^)]+\)' "$cleaned" 2>/dev/null | while IFS=: read -r lineno match; do
        url=$(echo "$match" | sed -E 's/.*\((https?:\/\/[^)]+)\).*/\1/')
        echo "$url" >> "$TEMP_URLS"
        echo "$url|$file:$lineno" >> "$URL_MAP"
    done

    # HTML links with double quotes: href="url" or src="url"
    grep -n -oE '(href|src)="https?://[^"]+"' "$cleaned" 2>/dev/null | while IFS=: read -r lineno match; do
        url=$(echo "$match" | sed -E 's/(href|src)="([^"]+)"/\2/')
        echo "$url" >> "$TEMP_URLS"
        echo "$url|$file:$lineno" >> "$URL_MAP"
    done

    # HTML links with single quotes
    grep -n -oE "(href|src)='https?://[^']+'" "$cleaned" 2>/dev/null | while IFS=: read -r lineno match; do
        url=$(echo "$match" | sed -E "s/(href|src)='([^']+)'/\2/")
        echo "$url" >> "$TEMP_URLS"
        echo "$url|$file:$lineno" >> "$URL_MAP"
    done
}

write_cache_file() {
    local valid_file="$1"
    local valid_count
    valid_count=$(wc -l < "$valid_file" | tr -d ' ')

    if [ "$valid_count" -eq 0 ]; then
        return 0
    fi

    echo "Updating $CACHE_FILE with $valid_count valid URLs..."

    {
        echo "# External Links Cache"
        echo "# Automatically updated: $(date '+%Y-%m-%d %H:%M:%S')"
        echo "# Validated URLs that passed link checking"
        echo ""
        sort -u "$valid_file"
    } > "$CACHE_FILE"
}

# Process all markdown files quickly
while IFS= read -r file; do
    skip=0
    for excl in "${EXCLUDE_FILES[@]}"; do
        if [[ "$file" == "$excl" ]]; then
            skip=1
            break
        fi
    done
    (( skip )) && continue

    CLEANED=$(mktemp)
    strip_code_blocks "$file" > "$CLEANED"
    extract_urls_from_file "$file" "$CLEANED"
    rm -f "$CLEANED"
done < <(find content -name "*.md" -type f)

# Remove duplicates and sort
ALL_URLS=$(sort -u "$TEMP_URLS" 2>/dev/null || true)
rm -f "$TEMP_URLS"

if [ -z "$ALL_URLS" ]; then
    echo "✅ No external links found"
    rm -f "$URL_MAP"
    exit 0
fi

# Load cached URLs (skip comments and empty lines)
CACHED_URLS=""
if [ "$REFRESH_CACHE" -eq 0 ] && [ -f "$CACHE_FILE" ]; then
    CACHED_URLS=$(grep -v '^#' "$CACHE_FILE" | grep -v '^[[:space:]]*$' || true)
fi

# Filter out cached URLs - only check new/uncached ones
if [ -n "$CACHED_URLS" ]; then
    TEMP_FILTERED=$(mktemp)
    echo "$ALL_URLS" | grep -vFx "$CACHED_URLS" > "$TEMP_FILTERED" || true
    URLS=$(cat "$TEMP_FILTERED")
    rm -f "$TEMP_FILTERED"

    TOTAL_URLS=$(echo "$ALL_URLS" | wc -l | tr -d ' ')
    CACHED_COUNT=$(echo "$CACHED_URLS" | wc -l | tr -d ' ')
    NEW_COUNT=$(echo "$URLS" | grep -c . || true)

    echo "Found $TOTAL_URLS total external URLs"
    echo "  - $CACHED_COUNT already validated (cached)"
    echo "  - $NEW_COUNT new URLs to check"
else
    URLS="$ALL_URLS"
    URL_COUNT=$(echo "$URLS" | grep -c . || true)
    if [ "$REFRESH_CACHE" -eq 1 ]; then
        echo "Found $URL_COUNT unique external URLs"
        echo "Validating all URLs (this may take a while)..."
    else
        echo "Found $URL_COUNT external URLs to check"
    fi
fi

if [ -z "$URLS" ]; then
    echo "✅ All external links are already cached as valid"
    rm -f "$URL_MAP"
    exit 0
fi

URL_COUNT=$(echo "$URLS" | grep -c . || true)
echo "Checking $URL_COUNT URLs..."
echo ""

# Create temp files
TEMP_FILE=$(mktemp)
VALID_FILE=$(mktemp)

# Maximum number of parallel jobs
MAX_JOBS=10

# Function to check a single URL
check_url() {
    local url="$1"
    local checked="$2"
    local total="$3"
    local temp_file="$4"
    local valid_file="$5"

    # Use curl to check the URL (follow redirects, timeout after 10s)
    HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" -L --max-time 10 --retry 1 "$url" 2>/dev/null || echo "000")

    case "$HTTP_CODE" in
        200|201|202|203|204|301|302|303|307|308)
            echo "[$checked/$total] ✓ $url ($HTTP_CODE)"
            echo "$url" >> "$valid_file"
            ;;
        000)
            echo "[$checked/$total] ❌ $url (TIMEOUT/ERROR)"
            printf '%s\t%s\n' "$url" "TIMEOUT/ERROR" >> "$temp_file"
            ;;
        *)
            echo "[$checked/$total] ❌ $url (FAILED: $HTTP_CODE)"
            printf '%s\t%s\n' "$url" "HTTP $HTTP_CODE" >> "$temp_file"
            ;;
    esac
}

export -f check_url

# Check URLs with controlled parallelism
CHECKED=0
while IFS= read -r url; do
    [ -z "$url" ] && continue
    CHECKED=$((CHECKED + 1))

    # Wait if we have too many background jobs
    while [ "$(jobs -r | wc -l | tr -d ' ')" -ge "$MAX_JOBS" ]; do
        sleep 0.1
    done

    check_url "$url" "$CHECKED" "$URL_COUNT" "$TEMP_FILE" "$VALID_FILE" &
done <<< "$URLS"

# Wait for all background jobs to complete
wait

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$REFRESH_CACHE" -eq 1 ]; then
    if [ -s "$VALID_FILE" ]; then
        write_cache_file "$VALID_FILE"
    else
        echo "No valid URLs to write to cache"
    fi
elif [ -s "$VALID_FILE" ]; then
    VALID_COUNT=$(wc -l < "$VALID_FILE" | tr -d ' ')
    echo "Adding $VALID_COUNT newly validated URLs to cache..."

    if [ -f "$CACHE_FILE" ]; then
        {
            grep -v '^#' "$CACHE_FILE" | grep -v '^[[:space:]]*$' || true
            cat "$VALID_FILE"
        } | sort -u > "${CACHE_FILE}.tmp"
    else
        sort -u "$VALID_FILE" > "${CACHE_FILE}.tmp"
    fi

    {
        echo "# External Links Cache"
        echo "# Automatically updated: $(date '+%Y-%m-%d %H:%M:%S')"
        echo "# Validated URLs that passed link checking"
        echo ""
        cat "${CACHE_FILE}.tmp"
    } > "$CACHE_FILE"
    rm -f "${CACHE_FILE}.tmp"
fi

if [ -s "$TEMP_FILE" ]; then
    FAILED=$(wc -l < "$TEMP_FILE" | tr -d ' ')
    echo "❌ $FAILED out of $URL_COUNT external links failed:"
    echo ""

    while IFS=$'\t' read -r url error_code; do
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ $url"
        echo "   Error: $error_code"
        echo "   Referenced in:"
        grep -F "^$url|" "$URL_MAP" | while IFS='|' read -r u file_line; do
            echo "     - $file_line"
        done
        echo ""
    done < "$TEMP_FILE"

    rm -f "$TEMP_FILE" "$VALID_FILE" "$URL_MAP"
    exit 1
fi

rm -f "$TEMP_FILE" "$VALID_FILE" "$URL_MAP"
if [ "$REFRESH_CACHE" -eq 1 ]; then
    echo "✅ Cache file updated"
else
    echo "✅ All $URL_COUNT external links are valid"
fi
exit 0
