#!/usr/bin/env bash
# frames -> frame-accurate mp4 for the compositor (public/shots/<name>.mp4)
set -euo pipefail
cd "$(dirname "$0")/../.."
for name in corridor_a corridor_b corridor_figure; do
  [ -d "public/shots/$name" ] || { echo "missing $name"; continue; }
  ffmpeg -v error -y -framerate 30 -i "public/shots/$name/%04d.jpg" -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p -g 1 -movflags +faststart "public/shots/$name.mp4"
  echo "$name: $(ls public/shots/$name/*.jpg | wc -l) frames -> $(du -h public/shots/$name.mp4 | cut -f1)"
done
