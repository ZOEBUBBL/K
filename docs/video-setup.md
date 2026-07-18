# Pose reel — shooting, keying, encoding

Four poses, one video file, buttons to switch. Here's how to produce it.

---

## Why video and not GIF

A 4-second loop at 720×960 is roughly 8 MB as a GIF and 250 KB as an MP4, and the
MP4 looks better — GIF is capped at 256 colours, which destroys exactly the kind of
soft purple gradient this room is built from. Three.js also can't use a GIF as a
texture without decoding it frame by frame in JavaScript. Video is strictly better
here, no tradeoff.

---

## Two files, not one

This is the part that makes the paywall real.

| File | Contains | Lives |
|---|---|---|
| `pose-free.mp4` | pose 1 only | public, next to `index.html` |
| `poses-full.mp4` | all 4 poses, back to back | R2 only, never in the repo |

If you ship one file with all four poses and just hide three behind a button, anyone
can pull the file from the network tab and watch the lot. Two files is the only
version that actually holds.

---

## Shooting

Green screen and image-to-video both work, and you can mix them — one or two filmed,
the rest generated. Keep the framing identical across all of them or the switch
between poses will feel like a jump cut.

**Framing.** 3:4 portrait, full body, same distance and same eye height every take.
Leave headroom — the plane is cropped by the keyhole and you don't want your head
clipped.

**Lighting the green.** Light the screen separately from yourself, evenly, and stand
at least a metre in front of it. Most bad keys are a lighting problem, not a software
problem. Uneven green is what produces the blotchy edges people blame on the keyer.

**Light yourself to match the room.** The room is deep purple with pale cyan
string lights. If you're lit with warm white you'll look pasted in. A cool rim from
behind and slightly to one side will do most of the work of selling it.

**Wear nothing green.** Obvious, but also: no green-adjacent teal, and watch out for
glossy black which picks up green bounce.

**Loop-friendly takes.** Start and end each pose in the same position, roughly still.
3–5 seconds each. A loop that snaps back visibly is worse than a shorter loop that
doesn't.

**Image-to-video specifically:** generate against a flat green background if the tool
will let you. If it won't, generate against flat black or flat white, set
`key.enabled: false` in the config, and I'll switch the shader to a luma key instead
— tell me which and I'll adjust it.

---

## Encoding

Concatenate your four poses in order, then encode with **forced keyframes at every
cut point.** This matters more than anything else in this file: seeking to a pose is
instant if there's a keyframe there and visibly laggy if there isn't.

```bash
# 1. concatenate (adjust names/order)
printf "file 'p1.mov'\nfile 'p2.mov'\nfile 'p3.mov'\nfile 'p4.mov'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy raw.mov

# 2. encode the full reel — keyframes forced at each pose boundary
ffmpeg -i raw.mov \
  -vf "scale=720:960:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -force_key_frames "0,4,8,12" \
  -crf 23 -movflags +faststart -an \
  poses-full.mp4

# 3. cut the free pose out as its own public file
ffmpeg -i poses-full.mp4 -ss 0 -t 4 \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 23 -movflags +faststart -an \
  pose-free.mp4
```

`-an` strips audio — you don't need it, and muted video is what lets iOS autoplay at
all. `+faststart` moves the index to the front so playback begins before the whole
file arrives.

Then set the real timecodes in `CONFIG.poses`. If your poses aren't exactly 4 seconds
each, run `ffprobe` on each source clip and use the actual durations — and match the
`-force_key_frames` list to the same numbers.

**Budget:** keep `poses-full.mp4` under about 4 MB. Event wifi is always worse than
you expect, and a card that spins for fifteen seconds is a card nobody sees.

---

## Tuning the key

Three dials in `CONFIG.key`, and you'll adjust them once on real footage:

- **`color`** — don't guess. Screenshot a frame, colour-pick your actual green, put
  that hex in. Studio green is nominally `0x00B140` but your screen under your lights
  is not that.
- **`similarity`** — how much colour counts as "green". Raise it if green survives
  around your edges. Lower it if parts of you are vanishing.
- **`smoothness`** — edge softness. Raise for hair and soft edges, lower for a crisp
  cut. Hair is always the hard part; err soft.
- **`spill`** — kills green fringing by pulling those pixels toward grey. Raise if you
  have a green halo, but too much and your edges go grey and dead.

Tune these on your phone, outdoors-ish lighting, not on your monitor. The key looks
different composited against the purple room than it does against your editor's
checkerboard.

---

## One thing to decide

Right now the free pose plays clear and unblurred, and the paid tier is *more poses*.
You'd originally wanted the free view blurred.

Both work with this code — if you want the free one blurred, just export
`pose-free.mp4` with the blur baked in during step 3 (`-vf "boxblur=20:2"` on the
face region, or blur the whole frame). My read is still that showing your face freely
and selling "more" converts better than selling "unblurred", and it doubles as an
actual business card that way. But it's your call and it's a one-line change.
