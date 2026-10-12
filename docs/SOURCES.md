# Content sources and editorial notes

Checked on **10 October 2026 (Asia/Shanghai)**.

## Identity

- [Google Scholar](https://scholar.google.com/citations?user=xtyiJv4AAAAJ&hl=en): Haoran Zhang; Master Student of School of Software, Tsinghua University; public contact `zdandsomsp@gmail.com`; eight listed publications; profile photograph.
- [GitHub](https://github.com/ZDandsomSP): account `ZDandsomSP`, Tsinghua University, master's student.
- The default portrait is the original Google Scholar photograph; hovering or focusing switches to the formal photograph supplied by the author on 10 October 2026. Both share a fixed frame to prevent layout shifts. The formal photograph uses proportional scaling with `object-fit: contain` so the complete image remains visible. The current favicon is an original transparent SVG stopwatch, replacing the previously supplied WebP/PNG image at the author's request. Public figure URLs and the portrait provenance are recorded in `data/asset-sources.json`. Images are stored locally so they do not require remote loading on page visits.

The introductory research narrative is an editorial synthesis of the papers, written in the first person for this draft. It is not a verbatim biography supplied by the author. The draft deliberately leaves out personal details that cannot be established from these sources.

## Publications

| Work | Primary reference | Notes |
| --- | --- | --- |
| Timer-M1 | [arXiv:2610.11734](https://arxiv.org/abs/2610.11734), [PDF](https://arxiv.org/pdf/2610.11734) | Added on 12 October 2026 from the author-provided link; 2026 preprint submitted 8 October. Full author order and first four authors' equal contribution verified in the PDF; thumbnail is Figure 4, evaluation overview. |
| TimeVista | [arXiv:2606.16173](https://arxiv.org/abs/2606.16173) | 2026 preprint; full author list from arXiv; June submission date. |
| Timer-S1 | [arXiv:2603.04791](https://arxiv.org/abs/2603.04791) | 2026 preprint; weights linked from the paper to [Hugging Face](https://huggingface.co/bytedance-research/Timer-S1). Co-first authorship is documented in the author's scholarship presentation. |
| DiTS | [arXiv:2602.06597](https://arxiv.org/abs/2602.06597) | 2026 preprint, revised 7 October 2026; first three authors marked equal contribution on the paper. |
| TimesBERT | [arXiv:2502.21245](https://arxiv.org/abs/2502.21245), [proceedings](https://doi.org/10.1145/3746027.3755238) | ACM Multimedia 2025 venue from Scholar; full author list from arXiv. Oral presentation is documented in both author-provided presentations. |
| TimeXer | [arXiv:2402.19072](https://arxiv.org/abs/2402.19072), [official code](https://github.com/thuml/TimeXer) | NeurIPS 2024. Author order follows the paper and Scholar; the repository README's citation has an outdated author list. First two authors contributed equally. |
| Timer | [ICML proceedings](https://proceedings.mlr.press/v235/liu24cb.html), [paper](https://arxiv.org/abs/2402.02368), [official code](https://github.com/thuml/Large-Time-Series-Model) | ICML 2024 rather than the preprint-only label in Scholar; first three authors contributed equally. |
| iTransformer | [paper](https://arxiv.org/abs/2310.06625), [OpenReview](https://openreview.net/forum?id=JePfAI8fah), [official code](https://github.com/thuml/iTransformer) | ICLR 2024 Spotlight; first three authors contributed equally. |
| SimMTM | [paper](https://arxiv.org/abs/2302.00861), [official code](https://github.com/thuml/SimMTM) | NeurIPS 2023 Spotlight; first two authors contributed equally. |

Paper descriptions are short editorial summaries of the primary-source abstracts. No numerical performance claims or fixed citation/star counts are embedded in the paper descriptions. No conference acceptance is inferred for the 2026 preprints. No unverified repository URL is shown for TimesBERT, DiTS, or TimeVista.

BibTeX entries are generated from the displayed metadata, rather than copied from an official publisher export. They include the paper's arXiv identifier and its verified conference venue when available.

The author's requested selection is Timer-M1, DiTS, Timer-S1, TimesBERT, Timer, and iTransformer, with Timer-M1 added first on 12 October 2026. The other three works remain available through the All link. TimesBERT uses its representation visualization; iTransformer uses the official repository's radar plot. Timer-S1 now uses the model architecture panel on the right of its architecture figure (x4.png); Timer uses the pre-training panel of its overview. Both use CSS cropping without stretching the source image. The October 2026 news item announces Timer-M1; the TimeVista news item has been removed at the author's request, while its paper remains in the complete publication list.

## Author-provided background

Two local presentations were read as source documents: the 2026 scholarship defense presentation and the master's-to-doctoral transfer defense presentation. Their original files and student identifiers are not included in the website repository.

- Education: Software Engineering at Tsinghua University, bachelor's September 2020–June 2024, graduate study August 2024–present. The author's latest correction on 12 October 2026 confirms the current status as a doctoral student in engineering, superseding the earlier master's status and historical public profiles. Education identifies the master's-to-Ph.D. track described in the transfer defense; August 2024 is the start of the combined graduate-study period, not an independently established doctoral transfer date. Grades, rankings, and honors are omitted at the author's request.
- Internships: the author-provided résumé supplies ByteDance International E-commerce supply chain algorithms (project internship, March–September 2026) and Huawei dynamic workload forecasting and optimization (project internship, October 2024–October 2025). About Me mentions the two companies in one sentence; Experience after Education lists the roles, dates, and a short work description. The other internship was removed at the author's request on 12 October 2026. The résumé's phone number, alternate email, grades, and awards are not copied to the website. The original résumé is not included in the repository.
- Interest list: time series foundation models, multimodal forecasting, and world models. The temporal representation learning item was removed and world models added as the final item at the author's request on 12 October 2026.
- Research interests: foundation models for time series, generative models, world models, multimodal reasoning, and physical intelligence. The biography is an editorial synthesis for the author's review.
- Open source: contributions to TSLib, as described in the presentations. GitHub star counts now use live Shields.io social badges for each respective repository, as requested by the author.

The author's message directly supplies reviewer service: ACM MM 2026; ICLR 2026 and 2027; ICML 2025 and 2026; NeurIPS 2024 and 2025. It also supplies teaching assistant service: 人工智能基础 in Spring 2026; 深度学习 in Fall 2025 and Fall 2026; 机器学习 in Spring 2025.

Scholarship applications are not presented as awarded honors. Under-review manuscripts are not presented as accepted papers. Current doctoral enrollment is based on the author's explicit correction, rather than inferred from the transfer defense alone.

## Theme

- Upstream: [yaoyao-liu/minimal-light](https://github.com/yaoyao-liu/minimal-light).
- Upstream commit: `1ea07f39518ac44644406380c83da6f89037c4fc`.
- Based on the upstream official `html_source_file` edition and compiled `style-no-dark-mode.css`, with a custom layout and responsive overrides. Remote font imports were removed for self-contained rendering.
- Upstream CC0 license retained in the root `LICENSE`; it does not change the rights attached to the profile photo or research figures.
- Visual reference: [manchery.github.io](https://manchery.github.io/), used for the general academic layout, not its biography or personal assets.
- Latest layout follows the reference's 970px wrapper, 250px sidebar, 60px column gap, 660px main column, 84px top spacing, Lato typography, and blue links. The author's portrait is smaller at 160px wide. The selected list has no year separators; the complete list retains them.
- At the author's request, a full-width interactive piano was added to the bottom of both pages. It uses original CSS and native JavaScript without a framework. The initial sine-wave synthesis was replaced with Alexander Holm's [Salamander Grand Piano / Yamaha C5 recordings](https://github.com/Tonejs/audio/blob/efd8296360f9526e379bfbe5c1698ff54d6a1d34/salamander/README), licensed CC BY 3.0 and distributed by Tonejs/audio (only its audio assets are used). The 21 unmodified MP3 samples are encoded into a 1.81 MB local Base64 data script, loaded near the footer and decoded on demand, including when the homepage is opened as a local file. `assets/audio/piano/manifest.json` pins every original MP3 URL; `CREDITS.txt` and `ORIGINAL-README.txt` preserve attribution, source information, and the license link. Playback maps adjacent notes by at most one semitone, retains the recordings' natural decay with a short release fade, and supports 24 simultaneous voices. Audio begins only after a user gesture and includes a mute control, following [MDN's Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices). The keyboard reduces its octave range on smaller screens, respects reduced-motion preferences, and is hidden in print.
- The piano now uses flat, square-edged keys without gradients or shadows, with black floating notes. The visible template credit, last-updated line, and back-to-top footer were removed at the author's request; the license remains in the repository. The gap between the final content section and the piano has been reduced.
- Lato Regular and Bold are distributed locally from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/lato), with their SIL Open Font License retained in `assets/fonts/OFL.txt`.
- The author's Chinese name, grades/rankings, separate Research Projects section, and Honors & Awards section were removed in the latest revision.

## Possible later additions

- Further refinements to the biography and any author-confirmed advisor relationship.
- A public CV or talks, if desired.
- Official code/project URLs for publications when provided.
- Preferred public domain.
