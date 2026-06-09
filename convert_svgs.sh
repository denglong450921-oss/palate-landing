#!/bin/bash
# Convert SVG placeholders to PNG info cards with metadata OVERLAY
# Uses ImageMagick 7 (magick) + rsvg-convert
# Info bar is overlaid as semi-transparent bottom strip (preserves original dimensions)

set -e
cd "$(dirname "$0")/images"

GREEN="#149C3D"
GOLD="#E5BA73"
WHITE="#FFFFFF"
FONT="/Library/Fonts/Arial Unicode.ttf"

# Format: OUTPUT|SVG_SRC|Page|SVG Size|Display Size|Purpose|Advice
IMAGES=(
  "logo.png|logo.svg|All Pages (Navbar)|320x48|28px height|Brand logo (dark)|Replace with hi-res brand logo"
  "logo-white.png|logo-white.svg|All Pages (Footer)|320x48|28px height|Brand logo (white)|Replace with white brand logo"
  "badge.png|badge.svg|index.html (Hero)|200x28|28px height|Brand badge/crest|Replace with actual brand badge"
  "hero-gastronomy-artistic.png|hero-gastronomy-artistic.svg|index.html (Hero BG)|1920x1080|Cover (100vh)|Homepage hero background|Replace with premium gastronomy photo"
  "hero-artisanal-food.png|hero-artisanal-food.svg|brands.html (Hero BG)|1920x1080|Cover|Brands page hero background|Replace with artisanal food photo"
  "hero-michelin-kitchen.png|hero-michelin-kitchen.svg|gastronomy.html (Hero BG)|1920x1080|Cover|Gastronomy page hero background|Replace with Michelin kitchen photo"
  "banner-consultation-room.png|banner-consultation-room.svg|inquiry.html (Banner)|1920x600|45vh (~400px)|Inquiry page banner|Replace with consultation room photo"
  "showcase-truffle-plating.png|showcase-truffle-plating.svg|gastronomy.html (Case Study)|800x600|300px height|Case study: truffle plating|Replace with truffle dish photo"
  "showcase-dessert-art.png|showcase-dessert-art.svg|gastronomy.html (Case Study)|800x600|300px height|Case study: dessert art|Replace with dessert art photo"
  "charity-sustainable-farming-v2.png|charity-sustainable-farming-v2.svg|brands.html (Charity)|800x600|400px height|Charity project image|Replace with farming charity photo"
)

echo "============================================"
echo " SVG → PNG with INFO OVERLAY"
echo "============================================"

for ENTRY in "${IMAGES[@]}"; do
  IFS='|' read -r OUTPUT SVG_SRC PAGE SVG_SIZE DISPLAY_SIZE PURPOSE ADVICE <<< "$ENTRY"
  echo ""
  echo ">>> $SVG_SRC → $OUTPUT"

  # Parse dimensions
  W=$(grep -oE 'width="[0-9]+"' "$SVG_SRC" | head -1 | sed 's/width="//;s/"//')
  H=$(grep -oE 'height="[0-9]+"' "$SVG_SRC" | head -1 | sed 's/height="//;s/"//')
  if [ -z "$W" ]; then
    VIEWBOX=$(grep -o 'viewBox="[^"]*"' "$SVG_SRC" | head -1 | sed 's/viewBox="//;s/"//')
    W=$(echo "$VIEWBOX" | awk '{print $3}')
    H=$(echo "$VIEWBOX" | awk '{print $4}')
  fi

  # Render SVG at original dimensions
  TMP_PNG="/tmp/svg_conv_$$_${RANDOM}.png"
  rsvg-convert "$SVG_SRC" -w "$W" -h "$H" -o "$TMP_PNG"
  echo "   Rendered: ${W}x${H}"

  # Determine info bar height (percentage of image height, capped)
  if [ "$H" -le 60 ]; then
    # Tiny images (logo, badge): overlay the entire image
    INFO_H=$H
    OVERLAY_Y=0
    FS=9
  elif [ "$H" -le 200 ]; then
    INFO_H=$((H * 60 / 100))
    OVERLAY_Y=$((H - INFO_H))
    FS=11
  elif [ "$H" -le 600 ]; then
    INFO_H=180
    OVERLAY_Y=$((H - INFO_H))
    FS=14
  else
    INFO_H=200
    OVERLAY_Y=$((H - INFO_H))
    # Responsive font
    if [ "$W" -gt 1200 ]; then
      FS=24
    else
      FS=16
    fi
  fi

  echo "   Overlay: ${W}x${INFO_H} at y=${OVERLAY_Y}, font=${FS}px"

  # Create overlay: semi-transparent green bar + text
  # Step 1: Draw semi-transparent overlay rectangle
  # Step 2: Write metadata text on top
  magick "$TMP_PNG" \
    -fill "rgba(20,156,61,0.88)" -draw "rectangle 0,${OVERLAY_Y} ${W},${H}" \
    -fill "$WHITE" -font "$FONT" -pointsize "$FS" \
    -gravity northwest \
    -annotate "+15+$((OVERLAY_Y + 5))" "PAGE: ${PAGE}" \
    -annotate "+15+$((OVERLAY_Y + FS + 10))" "SVG: ${W}x${H}  |  DISPLAY: ${DISPLAY_SIZE}" \
    -annotate "+15+$((OVERLAY_Y + 2*FS + 15))" "PURPOSE: ${PURPOSE}" \
    -annotate "+15+$((OVERLAY_Y + 3*FS + 20))" "ADVISE: ${ADVICE}" \
    -fill "$GOLD" -gravity northeast \
    -pointsize "$((FS - 2))" \
    -annotate "+15+$((OVERLAY_Y + 8))" "THE PALATE" \
    "$OUTPUT"

  rm -f "$TMP_PNG"
  BYTES=$(wc -c < "$OUTPUT" | tr -d ' ')
  echo "   Created: $OUTPUT (${BYTES} bytes, ${W}x${H})"
done

echo ""
echo "============================================"
echo " DONE — All conversions complete!"
echo "============================================"
ls -lh *.png
