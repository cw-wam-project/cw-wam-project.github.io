# CW-WAM anonymous project page

Static project page for **CW-WAM: A Structured Contact-Wrench World Action Model for Force-Sensitive Manipulation**. No build step, remote fonts, analytics, or external media players.

## Preview

On the website's Ubuntu host, run this from the website repository root:

```bash
python3 preview.py
```

The preview server supports byte-range requests for video seeking and PDF loading. It binds only to the host loopback interface. The host serves `index.html` at http://127.0.0.1:8000. When working over SSH, forward that port to your own computer before opening it in a browser. The repository's private project-context document records the confirmed SSH setup. `index.html` can also be opened locally with its assets folder alongside it.

## Current content (2026-09-23)

The page uses the author-supplied `CW-WAM_website_handoff` package. The repository includes the displayed assets; editable slides, source audio, and the complete trial archive remain in the handoff.

- Four task sections are displayed together and each offer **Method comparison**, **Single-method view**, and **More experiment videos** in one player, with four methods for peg/adapter/wiping and three for spring transport.
- The three view buttons share the same appearance and replace the content of the task’s existing player. **More experiment videos** shows the matching supplementary clip; spring transport additionally offers three method buttons for its repeated trials. There are no expandable video panels. View and method selections are independent across tasks.
- The full presentation is the supplied high-quality 1920 × 1080, 179.833-second master with narration (42.5 MB), replacing the compressed submission copy.
- Model, control, and task-result figures use the supplied high-resolution images; expandable panels add contact profiles, load adaptation, and wrench-feedback results.
- The four hero cards use the supplied cartoon task illustrations from the handoff images, displayed in full with contain sizing. Each card links to its corresponding task section.
- `assets/papers/cw-wam-paper.pdf` comes from `01_essential/paper.pdf`. This handoff PDF is byte-identical to the PDF previously hosted, so headline results remain unchanged.

Additional website material includes an expandable bilateral demonstration setup and interactive peg/wiping contact-force profiles with method toggles, optional interquartile bands, a phase readout, and downloadable CSV data. The curves expand Figure 5; they do not represent new experiments. Older local training-count and ablation documents differ from the final submission and are not imported.

The interface uses a near-white background, larger reading sizes, and a consistent method key: WAM red, WAM + Wrench orange, CW-WAM blue, and CW-WAM + admittance green. Supplied paper figures and comparison videos remain intact.

## Edit and replace assets

- `index.html`: structure, research copy, result captions, and interactive experiment sections.
- `styles.css`: layout and responsive styling.
- `script.js`: task descriptions, independent per-task view/method switching, supplementary-video selection, and interactive contact-force profiles.
- `preview.py`: optional local preview server with byte-range support; GitHub Pages serves the static assets independently.
- `assets/videos/{peg,adapter,wiping,transport}.mp4`: the four formal comparison videos.
- `assets/videos/{peg,adapter,wiping,transport}-cw-wam.mp4`: prepared CW-WAM single-method clips.
- `assets/videos/{peg-examples,adapter-repeated,ink-removal}.mp4`: the task-specific supplementary clips for peg, adapter, and wiping.
- `assets/videos/transport-repeated-{wam,wam-wrench,cw-wam}.mp4`: per-method concatenations of eight supplied 8× core lift/transport excerpts, in trial order; no re-encoding or new speed changes.
- `assets/videos/cw-wam-overview.mp4`: the full narrated high-quality presentation.
- `assets/videos/*-{wam,wam-wrench,cw-wam-admittance}.mp4`: additional individual method clips; spring transport has no admittance clip.
- `assets/data/contact-profiles.json`: exact numeric plotting samples grouped by task and method; arrays contain paper progress, method Q25/median/Q75, and demonstration Q25/median/Q75.
- `assets/data/{peg,wiping}-force-profiles.csv`: public plotting fields with original precision, excluding the illustrative video's remapped progress.
- `assets/images/demonstration-setup.webp`: the supplementary bilateral teleoperation figure.
- `assets/images/*-poster.jpg`: matched video posters; `*-single-poster.jpg` corresponds to independent trials.
- `assets/images/*-illustration.png`: the four source task illustrations used in the introductory grid; `*-hero.webp` retains the previous photo thumbnails.
- `assets/images/{architecture,execution,results,contact-profiles,load-adaptation,wrench-feedback}.webp`: web-sized versions of the supplied figure images, preserving their aspect ratios.
- `asset-sources.json`: paths relative to the handoff package for the principal media and figures.

Keep filenames stable when replacing a clip, and replace its poster too. Bump the `v` revision on asset URLs in `index.html` and the `asset` helper in `script.js` together so returning viewers fetch updated files. The current revision is `20260923-readable2`.

Videos use `preload="none"` and play on request. Switching a task’s view or method pauses its prior clip; starting another player pauses all others. All videos support progressive playback. The spring-transport single-view clip was remuxed with faststart, without changing its video frames or timing; the additional single-method videos were also remuxed with faststart and without re-encoding; the remaining videos were copied directly.

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
