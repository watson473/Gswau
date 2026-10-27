#!/bin/sh
# Regenerates the site icons from src/assets/brand/logo.png (macOS: uses sips).
# To swap the logo: replace src/assets/brand/logo.png (square PNG, cropped to the logo), then run:
#   npm run brand
set -e
cd "$(dirname "$0")/.."
LOGO=src/assets/brand/logo.png
sips -s format png -z 32 32 "$LOGO" --out public/favicon-32.png >/dev/null
sips -s format png -z 180 180 "$LOGO" --out public/apple-touch-icon.png >/dev/null
sips -s format png -z 512 512 "$LOGO" --out public/icon-512.png >/dev/null
TMP=$(mktemp -d)
sips -s format png -z 48 48 "$LOGO" --out "$TMP/ico.png" >/dev/null
sips -s format ico "$TMP/ico.png" --out public/favicon.ico >/dev/null
rm -rf "$TMP"
echo "Icons written to public/: favicon.ico, favicon-32.png, apple-touch-icon.png, icon-512.png"
