# CW-WAM anonymous project page

Static project page for **CW-WAM: A Structured Contact-Wrench World Action Model for Force-Sensitive Manipulation**. No build step, remote fonts, analytics, or external media players.

## Preview

On the website's Ubuntu host, run this from the website repository root:

```bash
python3 preview.py
```

The preview server supports byte-range requests for video seeking and PDF loading. It binds only to the host loopback interface. The host serves `index.html` at http://127.0.0.1:8000. When working over SSH, forward that port to your own computer before opening it in a browser. The repository's private project-context document records the confirmed SSH setup. `index.html` can also be opened locally with its assets folder alongside it.

## Current content (2026-09-23)

The page uses the author-supplied `CW-WAM_website_handoff` package. Only assets used by the page are included; editable slides, source audio, and the complete trial archive remain in the handoff.

- Four task tabs each offer **Method comparison** and **CW-WAM single view**.
- Three additional videos show peg failure/success examples, 20 consecutive adapter attempts, and six wiping patterns.
- The full presentation is the supplied 1920 × 1080, 179.833-second video with narration.
- Model, control, and task-result figures use the supplied high-resolution images; expandable panels add contact profiles, load adaptation, and wrench-feedback results.
- Hero images come from the independent CW-WAM trial videos at 20 s (peg), 6 s (adapter), and 5 s (wiping and transport).
- `assets/papers/cw-wam-paper.pdf` comes from `01_essential/paper.pdf`. This handoff PDF is byte-identical to the PDF previously hosted, so headline results remain unchanged.

## Edit and replace assets

- `index.html`: structure, research copy, result captions, and the three additional experiment cards.
- `styles.css`: layout and responsive styling.
- `script.js`: task descriptions, view-specific viewing guidance, task selection, and comparison/single-view switching.
- `preview.py`: optional local preview server with byte-range support; GitHub Pages serves the static assets independently.
- `assets/videos/{peg,adapter,wiping,transport}.mp4`: the four formal comparison videos.
- `assets/videos/{peg,adapter,wiping,transport}-cw-wam.mp4`: prepared CW-WAM single-method clips.
- `assets/videos/{peg-examples,adapter-repeated,ink-removal}.mp4`: the three additional experiment videos.
- `assets/videos/cw-wam-overview.mp4`: the full narrated presentation.
- `assets/images/*-poster.jpg`: matched video posters; `*-single-poster.jpg` corresponds to independent trials.
- `assets/images/*-hero.webp`: clean single-method frames used in the introductory task grid.
- `assets/images/{architecture,execution,results,contact-profiles,load-adaptation,wrench-feedback}.webp`: web-sized versions of the supplied figure images, preserving their aspect ratios.
- `asset-sources.json`: paths relative to the handoff package for the principal media and figures.

Keep filenames stable when replacing a clip, and replace its poster too. Bump the `v` revision on asset URLs in `index.html` and the `asset` helper in `script.js` together so returning viewers fetch updated files. The current revision is `20260923-review1`.

Videos use `preload="none"` and play on request. Switching tasks or views pauses the prior clip; starting another player pauses all others. All videos support progressive playback. The spring-transport single-view clip was remuxed with faststart, without changing its video frames or timing; the other videos were copied directly.

## Scientific labels

- Success rates summarize 20 attempts per method per contact task. They are not counts of selected website examples. Insertion and release are distinct outcomes.
- Headline force-reference RMSE uses the successful-trial subset of Figure 4.
- Preserve the supplied comparison videos' speed and curve labels. Independent clips are already prepared/cropped and may be accelerated; do not interpret playback duration as physical execution time or assign a common speed to all clips.
- No success/failure labels are inferred for independent CW-WAM clips whose catalog outcome is blank.
- Peg/wiping cohort curves and adapter illustrative reference traces do not establish synchronization with the displayed trial. Do not calculate cohort RMSE from a median curve.
- Six-pattern ink removal is 85.9% on the six selected patterns, separate from simple-pattern wiping success (20/20).
- Figure 7's representative-trial RMSE values and its 10-trial aggregate comparisons are distinct from Figure 4 headline values.

## Anonymous page

The visible page retains Anonymous Authors and has no invented author, affiliation, code, model, or dataset links. Media are taken from the supplied handoff. Local updates do not publish the site or change repository visibility.
