# Grok prompts — Through the Keyhole

Two rules before you start.

**Use the style block.** Paste `STYLE` at the end of every prompt. Grok drifts hard
between generations, and the whole illusion collapses if the left wall doesn't match
the back wall. The block is what keeps six separate images feeling like one room.

**Lock the palette.** Every prompt names the same five colours. Don't let it improvise
a teal or a warm orange in one panel — say the hex-adjacent colour names every time.

```
PALETTE
  void black        near-black with a violet cast, never flat
  deep amethyst     rich saturated purple, the dominant field
  bruised plum      darker purple for shadow and corners
  velvet crimson    deep red, slightly blue-leaning, the couch
  antique gold      muted brass, tarnished not shiny
  arcane cyan       pale blue-white light, the only cool highlight
```

```
STYLE
Painterly stylized game art, hand-painted texture over clean faceted forms.
Dark magical storybook fantasy — ornate, gothic, romantic, a little melancholy.
Strong chiaroscuro: deep bruised-plum shadows, pools of pale arcane cyan light,
tarnished antique gold catching the edges. Saturated but not neon. Visible brush
texture and crisp geometric edge definition. Cel-adjacent shading with soft
gradient falloff. No photorealism, no anime screencap look, no text, no watermark,
no signature, no logos.
```

---

## 1 — Card front  ·  `card-front.png`  ·  7:4 landscape

This is the tracker. It has a technical job: **dense fine detail, asymmetric,
textured darks.** Every flat area you allow costs you tracking stability.

> An ornate arcane keyhole plate mounted on a dark engraved panel, viewed straight on,
> flat and centred. The keyhole itself is a raised escutcheon of tarnished antique gold,
> heavily engraved with fine filigree, scrollwork and tiny sigils, the metal pitted and
> worn at the edges. Around it the panel is deep amethyst and bruised plum, covered
> edge to edge in intricate carved detail — interlocking geometric knotwork, hairline
> crack veins, scattered small stars, a wax-seal motif offset to the lower left, a
> spray of dried thorned roses running diagonally from the upper right corner.
> Deliberately asymmetric composition. Faint arcane cyan light bleeds from behind the
> keyhole aperture. Every dark area carries visible texture and fine detail — no flat
> black, no smooth gradients, no empty space, no large uniform fields.
> Flat frontal view, no perspective, no drop shadow, no border frame.
> STYLE

**Check it before you compile:** squint at it. If any region larger than a thumbnail
reads as one solid tone, add detail there and regenerate.

---

## 2 — Card back  ·  `card-back.png`  ·  7:4 landscape

Quieter — the QR code needs room to breathe and high contrast around it.

> A dark engraved panel in deep amethyst and bruised plum with fine carved knotwork
> texture, considerably simpler and calmer than an ornate front face. A large clean
> empty rectangular area in the centre-right, unadorned, for text placement. Delicate
> antique gold rule lines and small corner flourishes framing the composition. A
> scattering of tiny arcane cyan stars in the upper left. Flat frontal view, generous
> negative space, restrained.
> STYLE

Drop the QR in the empty area yourself, pure black on white. Don't let Grok generate
a QR — it will produce something that looks right and scans as nothing.

---

## 3 — Room back wall  ·  `room-back.png`  ·  1:1 square

The hero interior. This is what people see first through the keyhole.

> Interior of a cosy occult bedroom, viewed straight on, flat frontal perspective.
> An elaborate velvet crimson chesterfield couch runs along the wall, deeply buttoned
> and tufted, with carved dark wood legs and rolled arms, piled with mismatched
> cushions in deep amethyst and bruised plum. The wall behind is deep amethyst,
> patterned with a faded damask, half covered in pinned tarot cards, polaroids,
> concert flyers and torn sketch pages. A tarnished antique gold mirror hangs slightly
> crooked above the couch. Melted candles in brass holders on a low side table,
> stacked spellbooks, a chipped mug, string lights glowing pale arcane cyan draped
> along the wall. Cute and lived-in and a little chaotic — a real person's room, not a
> showroom. Warm and inviting despite the dark palette. Flat frontal view, no
> perspective distortion, evenly lit across the frame, no vignette.
> STYLE

The couch is the anchor. If a generation gives you a good couch and a bad wall,
keep it and inpaint the wall rather than rerolling from scratch.

---

## 4 — Side wall  ·  `room-side.png`  ·  1:1 square

You need one. Mirror it in an editor for the other side — that's free and it
guarantees the two sides match.

> Interior side wall of a cosy occult bedroom, viewed straight on, flat frontal
> perspective. Deep amethyst wall with faded damask pattern. A tall dark wood
> bookshelf crammed with spellbooks, crystals, small skulls, trailing plants and
> stacked art supplies. A narrow window with heavy bruised-plum velvet curtains
> mostly drawn, a sliver of pale arcane cyan moonlight coming through. Pinned photos
> and dried flowers on the wall beside it. Tarnished antique gold picture frames hung
> in a cluster. Lived-in, cute, a little cluttered. Flat frontal view, evenly lit,
> no perspective distortion, no vignette.
> STYLE

---

## 5 — Floor  ·  `room-floor.png`  ·  1:1 square

> Top-down overhead view of a bedroom floor. Dark stained wood boards, worn and
> scuffed. A large round rug in deep amethyst and bruised plum with a faded arcane
> circle pattern woven into it, edges slightly frayed. Scattered around it: a pair of
> boots kicked off, an open sketchbook, a game controller, a few loose tarot cards, a
> half-burnt candle. Directly overhead orthographic view, evenly lit, no perspective,
> no shadows cast from outside the frame.
> STYLE

---

## 6 — Ceiling  ·  `room-ceiling.png`  ·  1:1 square

Barely seen, so keep it cheap and dark — it just needs to not break the illusion.

> Overhead view of a dark bedroom ceiling. Bruised plum and void black, softly
> textured plaster with hairline cracks. Strings of tiny pale arcane cyan fairy lights
> criss-crossing the space, and a cluster of hanging paper stars and dried flowers in
> one corner. Mostly dark and simple. Directly overhead orthographic view, evenly lit,
> no perspective.
> STYLE

---

## 7 — The reveal  ·  `portrait-clean.png`  ·  3:4 portrait

A stylized version of you, standing in that room, lit by it.

> A stylized illustrated portrait of a young woman standing in a dark cosy occult
> bedroom, full body, facing the viewer, relaxed confident stance. Dark clothing with
> deep amethyst and velvet crimson accents, layered and a bit alternative. Rim-lit
> from behind in pale arcane cyan, with warm candlelight catching one side of her
> face. Soft focus on the room behind her so she reads as the clear subject.
> Expressive, warm, approachable, characterful. Vertical portrait framing, subject
> centred with space above her head.
> STYLE

Swap in your own features and hair — the more specific you are, the less generic it
comes back.

**For `portrait-blurred.png`:** don't generate a second one. Take the clean file into
an editor, apply a heavy gaussian blur to the face only — keep the silhouette, the
clothing and the lighting readable so there's something worth unlocking — and export
that as a separate flattened file. Bake the blur into the pixels. The clean file goes
straight into R2 and never near your repo.

---

## Fixing drift

Grok will wander. When panel five doesn't match panel three:

- Regenerate the *odd one out*, not the set — reroll the mismatched panel with the
  matching one described in words ("the wall is the same deep amethyst faded damask
  as the adjoining wall")
- Colour-match in post rather than rerolling. A curves adjustment is thirty seconds;
  a good regeneration is thirty minutes.
- Keep the first decent version of everything. Grok's fourth attempt is often worse
  than its first and you'll want to go back.

---

## When you've got them

Send me the room panels and I'll wire them into `index.html` as wall textures —
right now those surfaces are flat colour placeholders, and swapping them for painted
art is what turns the portal from a neat trick into somewhere that feels real.
