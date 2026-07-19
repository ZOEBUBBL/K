# Through the Keyhole

AR sticker business cards. Point a phone at the card and a keyhole opens into a room.

---

## Deploy in five minutes

```bash
git init
git add .
git commit -m "keyhole card"
git branch -M main
git remote add origin https://github.com/YOURNAME/keyhole-card.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save.**

Your page appears at `https://YOURNAME.github.io/keyhole-card/` in about a minute.

**This step is not optional.** Cameras only work in a secure context — `https://` or
`localhost`, nothing else. Opening `index.html` as a downloaded file gives you
`NotAllowedError: Permission denied` before the browser even asks you. That is not a
device permission problem and no amount of toggling settings will fix it.

### Testing locally instead

```bash
./serve.sh
# open http://localhost:8000 in Chrome on this machine
```

`localhost` is a secure context, so your webcam works. Fastest way to iterate.

---

## What still needs doing

- [ ] **Rework `art/card-front.png`** — see `docs/card-front-diagnostic.png`. 65% of the
      card is dead space for tracking. Detail in the margins, not just the plate.
- [ ] **Recompose the card art to 1.75:1.** All three card images are currently 1.49:1.
      A business card is 3.5 × 2 in.
- [ ] **Compile `targets.mind`** from the final card front. Upload the art to the MindAR
      image target compiler, download the `.mind`, drop it in the repo root. Needs 3+ stars.
- [ ] **Real QR** — `python3 tools/make-qr.py https://YOURNAME.github.io/keyhole-card/`.
      The one in `card-back.png` is generated art and scans as nothing.
- [ ] **Shoot the pose reel** — see `docs/video-setup.md`, then run
      `./tools/encode-poses.sh p1.mov p2.mov p3.mov p4.mov`.
- [ ] **Deploy the worker** — `cd worker && npx wrangler deploy`.
- [ ] **Fill in `CONFIG`** at the top of `index.html`: your links, worker URL, Stripe link.

---

## Test mode

`index.html` ships with `media.type: 'image'`, which uses `art/portrait-clean.png`
filling the back wall. That lets you verify tracking, the portal and the parallax
before any video exists. Switch to `'video'` when the reel is ready.

---

## Layout

```
index.html              the whole experience
art/                    room panels + card art
targets.mind            compiled tracker — you generate this
pose-free.mp4           free pose, public
worker/                 payment verification + signed URLs
tools/make-qr.py        card-back QR at print resolution
tools/encode-poses.sh   builds both video files with correct keyframes
docs/                   art prompts, video guide, tracking diagnostic
```

---

## What never gets committed

`.gitignore` covers these, but know why:

- **`poses-full.mp4`** — the paid reel. Lives in R2, served only through the worker
  behind a signed, expiring URL. If it lands in the repo, the paywall is decorative.
- **`art/portrait-clean.png`** — same reasoning, currently used for local testing only.

Everything in a GitHub Pages repo is public, including files you never link to.

---

## Tuning

All of it lives in the `CONFIG` block at the top of the script in `index.html`.

**`aperture`** — matched to the keyhole measured off `card-front.png`. `openTo: 1.85`
is how far the portal blooms past the printed keyhole once tracking locks. Re-measure
if you redraw the plate.

**`grade`** — per-panel colour multipliers. The side panel came back 21% brighter and
noticeably bluer than the back wall; these pull the set into one room. Tune by eye on
a phone, not a monitor.

**`key`** — chroma key thresholds. Don't guess `color`; screenshot a frame of real
footage and pick your actual green. Studio green under your lights is never the
nominal value.

**`mode`** — `'pay'` or `'follow'`. Both work. At the event itself, `follow` will
convert better with strangers and feeds the audience you actually want; keep `'pay'`
for people who scan the card later, already curious. Print two small batches with
different QR codes and let the event settle it.
