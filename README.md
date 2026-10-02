# CW-WAM anonymous project page

Static project page for **CW-WAM: A Structured Contact-Wrench World Action Model for Force-Sensitive Manipulation**. No build step, remote fonts, analytics, or external media players.

## Preview

From the website repository root on its Ubuntu host:

```bash
python3 preview.py
```

This optional server binds to `127.0.0.1:8000` and supports byte-range requests for videos and the PDF. When connecting over SSH, use the previously configured local port forwarding. GitHub Pages serves the same static files independently.

## Presentation and copy policy (2026-09-28)

The page uses a white, spacious research-project layout, with a large blue CW-WAM heading above the full paper subtitle, compact resource links, an 860 px abstract column, and 1040 px media sections: the paper title and anonymous author line, a 2×2 looping video cover, the scientific abstract, the complete narrated video, three text navigation links, four detailed task players, Figure 1 with its original paper caption, the model and controller figures, and selectable result figures. Subtle 1 px gray rules (#d5dbe2) separate major sections after the three navigation links, starting with the experiments. The title, cover, abstract, and overview video have no section dividers. The four detailed tasks have no internal dividers. Body text is 21 px on desktop and generally 19 px on phones; captions are 18/17 px. Promotional slogans, metric cards, viewing tips, sidebars, the supplementary hardware panel, and the interactive curve widget are no longer displayed.

Authored page headings, paragraphs, captions, button terms, and accessible text are sourced from the final hosted paper; the author explicitly requested the resource label Paper as an exception. Other button wording follows the paper-vocabulary-or-icons policy. `paper-copy-sources.json` records the quoted excerpts and their PDF pages. Normalization allows capitalization, punctuation, and PDF line wrapping; it does not paraphrase scientific prose. The abstract reproduces its scientific text, omitting the self-referential website address. Shorter captions are contiguous excerpts of the corresponding paper captions. Text already embedded in supplied images/videos and native browser media controls is outside the editable HTML copy.

The title-area Paper and Video actions use dark, rounded publication buttons. After the full video, three descriptive section links use emphasized blue text separated by centered dots, without underlines or a filled background. Video views, method selectors, and result selectors retain Chrome-like tabs: pale gray strips, rounded upper corners, and white selected tabs. Navigation links stay on one line at 17 px (16 px on phones), with horizontal scrolling when needed. Narrow screens wrap title-area buttons and scroll experiment/result strips horizontally without shrinking labels. Native browser media controls retain their standard appearance.

The visual reference is [Nerfies](https://nerfies.github.io/): centered publication typography, restrained navigation, and open figure sections. The existing HTML/CSS implementation is adapted independently; template source, fonts, scripts, and analytics are not imported. The author-requested Chrome-style controls remain in place. The cover previews are separate from the detailed experiments: title and cover → Abstract → Video → section navigation → four detailed tasks → combined method section (Figures 1–3) → Results. The experiment heading and introductory sentence appear only above the detailed task players. Cover previews use two columns on desktop and one on phones.

Figures 1–3 share one method section titled “CW-WAM: Contact-Wrench World Action Model” (paper Figure 2). Internal figure groups have spacing but no horizontal dividers. The three navigation links target tasks (`#demos`), the combined method (`#method`), and results (`#results`), using paper-derived titles.

The architecture figure is accompanied by three brief explanations matching the supplied slide structure: recent paired history, pair-causal attention, and long-term wrench memory. The headings and explanations quote the final paper (pages 2–3), with sources recorded in `paper-copy-sources.json`. The architecture section has a wider desktop layout: the figure sits on the left and the three explanations stack vertically on the right. On screens up to 900 px wide, the explanations move below the figure.

## Video views

All four tasks remain visible, with an independent shared player for each task:

- **Comparison**: the supplied multi-method comparison.
- **Robot Execution**: the individual method clips, with red WAM, orange WAM + Wrench, blue CW-WAM, and green CW-WAM + Adm. controls. Transport has three methods.
- **Task completion**: peg failure/success examples, repeated adapter insertions, six-pattern wiping, or transport repetitions. Transport offers three methods and remembers this selection independently of its single-view selection.

Full experiment videos load on demand (`preload="none"`). A view/method change pauses that player; starting a full video pauses other full players and homepage previews. All source timing and footage remain unchanged. The source trials are prepared clips and may be accelerated. Transport repetitions concatenate eight supplied 8× core lift/transport excerpts per method, preserving their 640×524 source frames; they are selected examples, not a complete evaluation cohort. Do not infer physical execution time from playback duration or assign new outcomes to clips with blank catalog outcomes.

The complete presentation uses the supplied 1920×1080 high-quality master, 179.833 seconds and 42,527,851 bytes, with its original audio. The PDF is byte-identical to the author-designated final submission.

Task previews use 640×360 H.264 derivatives of the existing single-method clips, without audio or changes to playback speed. The peg cover preview uses the full author-edited `02_supplementary/individual_trials/peg_insertion/new.mp4` (about 20.24 seconds), with a matching first-frame poster and no further trimming; the other previews retain their full duration. Full experiment clips remain unchanged. Peg, adapter, and wiping use CW-WAM + Adm.; transport uses CW-WAM because no admittance clip is available for that task. The four muted loops play together while visible and stop when off-screen, when the tab is hidden, or when a full player is running. The icon button pauses/resumes them together; reduced-motion settings default to paused. Original cartoon assets remain available for reverting the preview.

## Files

- `index.html`: paper-derived copy, native media, task sections, and figures.
- `styles.css`: complete layout and responsive typography.
- `script.js`: independent task players, viewport-aware homepage loops, exclusive full-video playback, and keyboard-accessible result tabs. It inserts no promotional or explanatory copy.
- `paper-copy-sources.json`: text provenance against `assets/papers/cw-wam-paper.pdf`.
- `asset-sources.json`: media paths relative to the supplied handoff, plus explicitly documented derived media.
- `assets/images/*-illustration.png`: original task illustrations, retained as an alternative to the homepage video previews.
- `assets/images/{architecture,execution,results,contact-profiles,load-adaptation,wrench-feedback}.webp`: supplied paper figures.
- `assets/videos/`: the existing comparison, individual-method, outcome, and narrated presentation videos.
- `assets/data/` and `assets/images/demonstration-setup.webp`: retained assets from the earlier design, currently not displayed.

The stylesheet revision is `20261001-nav-inline1`; the script revision is `20260928-previews1`. Bump these resource query strings when changing their contents. Media filenames are stable; use a new media revision if an existing file is replaced. No-JavaScript visitors can play all four comparison videos and the presentation, open the supplemental media links, and view every result figure.

## Anonymous page

The page retains Anonymous Authors. It contains no added author names, affiliations, personal links, or invented code/model releases. Local edits do not push to GitHub or change the deployment configuration.

The Code button currently links to https://www.google.com/ as a temporary destination explicitly requested by the author. Replace it with the actual repository URL when supplied.

## Citation and footer

The user requested a Citation section and footer based on the Scaling Up project page. The BibTeX entry is an anonymous `@misc` record containing the paper title, Anonymous Authors, and project URL; no publication venue or year is asserted. The footer credits the Nerfies visual reference, links this website repository, and carries the user-requested CC BY-SA 4.0 notice. This utility/footer copy is an explicit exception to the paper-only text policy. Contact details are omitted until the author supplies an anonymous contact address. No analytics scripts are imported.
