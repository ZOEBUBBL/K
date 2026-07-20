#!/usr/bin/env bash
# Build the two video files from your four pose clips.
#
#   ./tools/encode-poses.sh p1.mov p2.mov p3.mov p4.mov
#
# Produces poses-full.mp4 (goes to R2) and pose-free.mp4 (goes in the repo).
# Keyframes are forced at every pose boundary so switching is instant.
set -euo pipefail

[ $# -lt 2 ] && { echo "give me at least two clips"; exit 1; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# durations and cumulative cut points
CUTS=""; ACC=0; LIST="$TMP/list.txt"; : > "$LIST"
for f in "$@"; do
  echo "file '$(realpath "$f")'" >> "$LIST"
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  CUTS="${CUTS:+$CUTS,}$ACC"
  ACC=$(python3 -c "print(round($ACC + $D, 3))")
done

echo "cut points: $CUTS"
echo "total: ${ACC}s"

ffmpeg -y -f concat -safe 0 -i "$LIST" -c copy "$TMP/raw.mov"

ffmpeg -y -i "$TMP/raw.mov" \
  -vf "scale=720:960:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -force_key_frames "$CUTS" \
  -crf 23 -movflags +faststart -an \
  poses-full.mp4

FIRST=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
ffmpeg -y -i poses-full.mp4 -ss 0 -t "$FIRST" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 23 -movflags +faststart -an \
  pose-free.mp4

echo
echo "done. Put these timecodes in CONFIG.poses:"
ACC=0
for f in "$@"; do
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  END=$(python3 -c "print(round($ACC + $D, 2))")
  echo "  {start: $ACC, end: $END}"
  ACC=$END
done
echo
echo "poses-full.mp4 -> upload to R2, do NOT commit"
echo "pose-free.mp4  -> commit this one"
ls -la poses-full.mp4 pose-free.mp4
