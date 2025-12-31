#!/bin/bash
# Check internal documentation links for issues
# - Links missing language prefix (/docs/ instead of /en/docs/)
# - HTML links that should use doclink shortcodes
# - Hardcoded /docs/ links that should use doclink shortcodes

set -e

contentDir="content"
error_count=0
warning_count=0

echo "Checking internal documentation links..."
echo ""

# Function to strip code blocks (same as check-external-links.sh)
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

# Process each markdown file
for file in $(find "$contentDir" -name "*.md" -type f); do
    # Strip code blocks
    CLEANED=$(mktemp 2>/dev/null || echo "/tmp/check-internal-$$-$(basename "$file")")
    strip_code_blocks "$file" > "$CLEANED"
    
    # Check for HTML links with /docs/ (missing language prefix or should use doclink)
    if grep -q 'href=["'\'']/docs/' "$CLEANED" 2>/dev/null; then
        grep -n 'href=["'\'']/docs/' "$CLEANED" 2>/dev/null | while IFS=: read -r lineno line; do
            # Extract the href value
            href=$(echo "$line" | sed -E 's/.*href=["'\'']([^"'\'']+)["'\''].*/\1/')
            echo "❌ $file:$lineno"
            echo "   Bad HTML link (missing language prefix or should use doclink):"
            echo "   href=\"$href\""
            echo ""
        done
        error_count=$((error_count + 1))
    fi
    
    # Check for markdown links with /docs/ (missing language prefix)
    if grep -q '\]\(/docs/' "$CLEANED" 2>/dev/null; then
        grep -n '\]\(/docs/' "$CLEANED" 2>/dev/null | while IFS=: read -r lineno line; do
            # Extract the link
            link=$(echo "$line" | sed -E 's/.*\]\(([^)]+)\).*/\1/')
            echo "❌ $file:$lineno"
            echo "   Bad markdown link (missing language prefix or should use doclink):"
            echo "   $link"
            echo ""
        done
        error_count=$((error_count + 1))
    fi
    
    # Check for absolute links with language prefix (should use doclink) - warnings only
    if grep -qE '(href=["'\'']/[a-z-]+/docs/|]\(/[a-z-]+/docs/)' "$CLEANED" 2>/dev/null; then
        grep -n -E '(href=["'\'']/[a-z-]+/docs/|]\(/[a-z-]+/docs/)' "$CLEANED" 2>/dev/null | while IFS=: read -r lineno line; do
            # Extract the link
            if echo "$line" | grep -q 'href='; then
                link=$(echo "$line" | sed -E 's/.*href=["'\'']([^"'\'']+)["'\''].*/\1/')
            else
                link=$(echo "$line" | sed -E 's/.*\]\(([^)]+)\).*/\1/')
            fi
            echo "⚠️  $file:$lineno"
            echo "   Link with language prefix (consider using doclink shortcode):"
            echo "   $link"
            echo ""
        done
        warning_count=$((warning_count + 1))
    fi
    
    rm -f "$CLEANED"
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $error_count -gt 0 ]; then
    echo "❌ Found issues in $error_count file(s) - links missing language prefix or should use doclink shortcodes"
    echo ""
    echo "To fix these issues, run:"
    echo "  node scripts/doclinks.js --mode=doclink"
    echo ""
    exit 1
elif [ $warning_count -gt 0 ]; then
    echo "⚠️  Found warnings in $warning_count file(s) - links with language prefix (consider using doclink shortcodes)"
    echo ""
    echo "To convert these to doclink shortcodes, run:"
    echo "  node scripts/doclinks.js --mode=doclink"
    echo ""
    exit 0
else
    echo "✅ All internal links are properly formatted"
    exit 0
fi
