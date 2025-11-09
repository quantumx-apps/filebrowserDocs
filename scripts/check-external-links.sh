#!/bin/bash
# Check external links in markdown files

set -e

# Cache file location
CACHE_FILE=".external-links"

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

# Process all markdown files quickly
find content -name "*.md" -type f | while read file; do
    # Strip code blocks to temp file
    CLEANED=$(mktemp)
    strip_code_blocks "$file" > "$CLEANED"
    
    # Extract markdown links: [text](url) or ![alt](url)
    grep -n -oP '!?\[[^\]]*\]\(https?://[^)]+\)' "$CLEANED" 2>/dev/null | while IFS=: read lineno match; do
        url=$(echo "$match" | sed -E 's/.*\((https?:\/\/[^)]+).*/\1/')
        echo "$url" >> "$TEMP_URLS"
        echo "$url|$file:$lineno" >> "$URL_MAP"
    done
    
    # Extract HTML links: href="url" or src="url"
    grep -n -oP '(href|src)=["'\'']https?://[^"'\'']+["'\'']' "$CLEANED" 2>/dev/null | while IFS=: read lineno match; do
        url=$(echo "$match" | sed -E 's/(href|src)=["'\'']([^"'\'']+)["'\'']/\2/')
        echo "$url" >> "$TEMP_URLS"
        echo "$url|$file:$lineno" >> "$URL_MAP"
    done
    
    rm -f "$CLEANED"
done

# Remove duplicates and sort
ALL_URLS=$(sort -u "$TEMP_URLS" 2>/dev/null || echo "")
rm -f "$TEMP_URLS"

if [ -z "$ALL_URLS" ]; then
    echo "✅ No external links found"
    rm -f "$URL_MAP"
    exit 0
fi

# Load cached URLs (skip comments and empty lines)
CACHED_URLS=""
if [ -f "$CACHE_FILE" ]; then
    CACHED_URLS=$(grep -v '^#' "$CACHE_FILE" | grep -v '^[[:space:]]*$' || true)
fi

# Filter out cached URLs - only check new/uncached ones
if [ -n "$CACHED_URLS" ]; then
    TEMP_FILTERED=$(mktemp)
    echo "$ALL_URLS" | grep -vFx "$CACHED_URLS" > "$TEMP_FILTERED" || true
    URLS=$(cat "$TEMP_FILTERED")
    rm -f "$TEMP_FILTERED"
    
    TOTAL_URLS=$(echo "$ALL_URLS" | wc -l)
    CACHED_COUNT=$(echo "$CACHED_URLS" | wc -l)
    NEW_COUNT=$(echo "$URLS" | wc -l)
    
    echo "Found $TOTAL_URLS total external URLs"
    echo "  - $CACHED_COUNT already validated (cached)"
    echo "  - $NEW_COUNT new URLs to check"
else
    URLS="$ALL_URLS"
    echo "Found $(echo "$URLS" | wc -l) external URLs to check"
fi

if [ -z "$URLS" ]; then
    echo "✅ All external links are already cached as valid"
    rm -f "$URL_MAP"
    exit 0
fi

URL_COUNT=$(echo "$URLS" | wc -l)
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
            echo "$url	TIMEOUT/ERROR" >> "$temp_file"
            ;;
        *)
            echo "[$checked/$total] ❌ $url (FAILED: $HTTP_CODE)"
            echo "$url	HTTP $HTTP_CODE" >> "$temp_file"
            ;;
    esac
}

export -f check_url

# Check URLs with controlled parallelism
CHECKED=0
while IFS= read -r url; do
    CHECKED=$((CHECKED + 1))
    
    # Wait if we have too many background jobs
    while [ $(jobs -r | wc -l) -ge $MAX_JOBS ]; do
        sleep 0.1
    done
    
    # Start checking URL in background
    check_url "$url" "$CHECKED" "$URL_COUNT" "$TEMP_FILE" "$VALID_FILE" &
done <<< "$URLS"

# Wait for all background jobs to complete
wait

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Update cache with newly validated URLs
if [ -s "$VALID_FILE" ]; then
    VALID_COUNT=$(wc -l < "$VALID_FILE")
    echo "Adding $VALID_COUNT newly validated URLs to cache..."
    
    # Append new valid URLs to cache file (sorted and unique)
    if [ -f "$CACHE_FILE" ]; then
        cat "$CACHE_FILE" "$VALID_FILE" | grep -v '^#' | grep -v '^[[:space:]]*$' | sort -u > "${CACHE_FILE}.tmp"
    else
        sort -u "$VALID_FILE" > "${CACHE_FILE}.tmp"
    fi
    
    # Add header and save
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
    FAILED=$(wc -l < "$TEMP_FILE")
    echo "❌ $FAILED out of $URL_COUNT external links failed:"
    echo ""
    
    # Show each failed URL with its source files
    while IFS=$'\t' read -r url error_code; do
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ $url"
        echo "   Error: $error_code"
        echo "   Referenced in:"
        grep "^$url|" "$URL_MAP" | while IFS='|' read -r u file_line; do
            echo "     - $file_line"
        done
        echo ""
    done < "$TEMP_FILE"
    
    rm -f "$TEMP_FILE" "$VALID_FILE" "$URL_MAP"
    exit 1
else
    rm -f "$TEMP_FILE" "$VALID_FILE" "$URL_MAP"
    echo "✅ All $URL_COUNT external links are valid"
    exit 0
fi
