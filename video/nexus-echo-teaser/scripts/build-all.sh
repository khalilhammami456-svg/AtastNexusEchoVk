#!/usr/bin/env bash
# audio -> master render -> delivery encode -> verify
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/audio.mjs
node scripts/render.mjs --out out/nexus-echo-teaser-master.mp4
ffmpeg -v error -y -i out/nexus-echo-teaser-master.mp4 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -profile:v high -c:a copy -movflags +faststart out/nexus-echo-teaser.mp4
node scripts/verify.mjs out/nexus-echo-teaser.mp4
