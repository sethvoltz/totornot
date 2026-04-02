# Changelog

## [1.5.0](https://github.com/sethvoltz/totornot/compare/totornot-v1.4.0...totornot-v1.5.0) (2026-04-02)


### Features

* implement comprehensive security hardening ([#32](https://github.com/sethvoltz/totornot/issues/32)) ([6685536](https://github.com/sethvoltz/totornot/commit/668553682b0a34d43167a4b286e9ad9e75d894ec))


### Bug Fixes

* rate limiter and remove Turnstile ([#34](https://github.com/sethvoltz/totornot/issues/34)) ([614dfe2](https://github.com/sethvoltz/totornot/commit/614dfe23f1b8137b845d55745ca24adc0af7139d))
* rate limiter security hardening and Turnstile removal ([#33](https://github.com/sethvoltz/totornot/issues/33)) ([af994a2](https://github.com/sethvoltz/totornot/commit/af994a21f855d1121e2c3a606addfb78817ed4b1))
* token bucket rate limiter ([#36](https://github.com/sethvoltz/totornot/issues/36)) ([3550dc0](https://github.com/sethvoltz/totornot/commit/3550dc0b9107e9b0f33d85898a68bca39b866b48))

## [1.4.0](https://github.com/sethvoltz/totornot/compare/totornot-v1.3.0...totornot-v1.4.0) (2026-04-02)


### Features

* add IP tracking to votes and dish submissions ([#29](https://github.com/sethvoltz/totornot/issues/29)) ([79a9d06](https://github.com/sethvoltz/totornot/commit/79a9d060cef2aad5fb57f25aa7f843bc674b9a67))

## [1.3.0](https://github.com/sethvoltz/totornot/compare/totornot-v1.2.0...totornot-v1.3.0) (2026-04-02)


### Features

* add responsive mobile layout for voting and leaderboard ([#27](https://github.com/sethvoltz/totornot/issues/27)) ([28846da](https://github.com/sethvoltz/totornot/commit/28846da6f34d923d0cec261aa688b67b13eaeabb))

## [1.2.0](https://github.com/sethvoltz/totornot/compare/totornot-v1.1.1...totornot-v1.2.0) (2026-04-01)


### Features

* add tip line for dish suggestions ([#23](https://github.com/sethvoltz/totornot/issues/23)) ([06f945d](https://github.com/sethvoltz/totornot/commit/06f945d8ad28323804b7ef60a964894553ed3d00))


### Bug Fixes

* add PUBLIC_TURNSTILE_SITE_KEY to wrangler config ([#25](https://github.com/sethvoltz/totornot/issues/25)) ([3443c75](https://github.com/sethvoltz/totornot/commit/3443c75f80f980bb1098c3a33bb63427b2acaf0f))
* **ci:** add proper pnpm and Playwright browser caching ([#24](https://github.com/sethvoltz/totornot/issues/24)) ([f153948](https://github.com/sethvoltz/totornot/commit/f153948f7799a9b36c59ef140aeccb8d83e340ab))

## [1.1.1](https://github.com/sethvoltz/totornot/compare/totornot-v1.1.0...totornot-v1.1.1) (2026-04-01)


### Bug Fixes

* add push trigger to release workflow ([#19](https://github.com/sethvoltz/totornot/issues/19)) ([618e1fe](https://github.com/sethvoltz/totornot/commit/618e1fed56511302f763efe08dc8796525f61981))
* only trigger release on merged autorelease PRs ([#21](https://github.com/sethvoltz/totornot/issues/21)) ([52fc445](https://github.com/sethvoltz/totornot/commit/52fc445f0e37f4ac8a96d54c84fe9aa780dbb934))

## [1.1.0](https://github.com/sethvoltz/totornot/compare/totornot-v1.0.0...totornot-v1.1.0) (2026-04-01)


### Features

* Add CI pipeline with validation jobs ([#2](https://github.com/sethvoltz/totornot/issues/2)) ([6f2b933](https://github.com/sethvoltz/totornot/commit/6f2b933ab35861585b5d4d8edfaa64d7b3f2791f))
* add D1 binding to wrangler.jsonc and document Turnstile env vars (to-chx) ([78e1ad8](https://github.com/sethvoltz/totornot/commit/78e1ad89563047412d559bd7a0a4574cf1a14c1f))
* add DishCard.svelte component (to-19b) ([0608c45](https://github.com/sethvoltz/totornot/commit/0608c4508109f14381e2e657875a5fc9eb442095))
* add Elo calculation utility with calculateExpected, updateElo, processVote (to-58a) ([9610729](https://github.com/sethvoltz/totornot/commit/96107296d9670b9273b89033810576ef3b92889e))
* add husky, commitlint, and lint-staged for git hooks ([23df0ec](https://github.com/sethvoltz/totornot/commit/23df0ece166acf4d60445d43b86d8fd3cc9d8975))
* Add local Lighthouse CI testing and performance improvements ([#7](https://github.com/sethvoltz/totornot/issues/7)) ([f4ea709](https://github.com/sethvoltz/totornot/commit/f4ea709a68fc275a946885e087aa8321f3fd12b7))
* add nav bar with site name and leaderboard link (to-8xx) ([03449ca](https://github.com/sethvoltz/totornot/commit/03449cab9d088f8c41d57104d2ed73309a1a9122))
* add Playwright E2E tests with text-based selectors ([eaa4094](https://github.com/sethvoltz/totornot/commit/eaa4094e3e66782985252144635162d7a46b4625))
* add real photos for all potato dishes ([#9](https://github.com/sethvoltz/totornot/issues/9)) ([094c361](https://github.com/sethvoltz/totornot/commit/094c361c25ff31bf7956e5d25ad1578970ec3c75))
* add release-please workflow with GitHub App auth ([#14](https://github.com/sethvoltz/totornot/issues/14)) ([dbe14ad](https://github.com/sethvoltz/totornot/commit/dbe14ad8b79a94cb44aef8cfa6cae11a732619cb))
* add staging/production deploy workflow with Cloudflare Workers ([#11](https://github.com/sethvoltz/totornot/issues/11)) ([ea8b789](https://github.com/sethvoltz/totornot/commit/ea8b7898c5cc103a4a405893a801d5be30ea6360))
* add voting animation ([#8](https://github.com/sethvoltz/totornot/issues/8)) ([fd2679e](https://github.com/sethvoltz/totornot/commit/fd2679e43c9cd0ac30ebc12ed0b38180e23dbf21))
* bump to 1.0.0 for stable versioning ([#17](https://github.com/sethvoltz/totornot/issues/17)) ([6235fa8](https://github.com/sethvoltz/totornot/commit/6235fa819fdb1ab76aa702ee003f24a3bbab9a01))
* elo engine, types, layout nav, wrangler D1 + Turnstile config ([1862916](https://github.com/sethvoltz/totornot/commit/1862916f97017833fa84238afd89b58cfbca0d7f))
* implement voting system with Elo rankings and D1 migrations ([829dc83](https://github.com/sethvoltz/totornot/commit/829dc83eac7825ef15af457e8842afbe994011e5))
* initial npx sv create ([730375e](https://github.com/sethvoltz/totornot/commit/730375ef00b879c5917450d0090737c7954936d3))
* migrate from external to local images with attribution support ([5fcba13](https://github.com/sethvoltz/totornot/commit/5fcba13f88d6eb650b7ea7f9758d3b8a90a19203))
* replace placeholder schema with dishes/votes/rate_limits tables and potato seed (to-ero) ([3cdc6db](https://github.com/sethvoltz/totornot/commit/3cdc6db370692104168696b50c27a416041fba94))


### Bug Fixes

* add CLOUDFLARE_ACCOUNT_ID env var for wrangler auth ([#12](https://github.com/sethvoltz/totornot/issues/12)) ([74b3c3f](https://github.com/sethvoltz/totornot/commit/74b3c3f46c0ffcc2a5da6c32afe8ac98c28f21b0))
* address copilot feedback from PR [#2](https://github.com/sethvoltz/totornot/issues/2) ([aa47c1d](https://github.com/sethvoltz/totornot/commit/aa47c1d5154dd546474ef5e652093545d61ec8e0))
* ignore CHANGELOG.md from prettier formatting ([#16](https://github.com/sethvoltz/totornot/issues/16)) ([c03476c](https://github.com/sethvoltz/totornot/commit/c03476c391b8ee199363d1a3a06ee69e3eb41074))
* little bugger ([13201c4](https://github.com/sethvoltz/totornot/commit/13201c4a8a0f63c0f8706edb5219489319112351))
* lots of little things ([e89cfee](https://github.com/sethvoltz/totornot/commit/e89cfee2287119b6010c22e17c99e606f22723b9))
* optimize favicon imges ([#13](https://github.com/sethvoltz/totornot/issues/13)) ([d06dd56](https://github.com/sethvoltz/totornot/commit/d06dd56575842f1c74ac3c8349fe86a92f4a9a0e))
* preserve voting state across HMR by using module-level state with Vite hot data ([afd79a4](https://github.com/sethvoltz/totornot/commit/afd79a4458b9e22145b63db670dba43db0080dd2))
* rename Spud Supremacy to Tot or Not (to-41a) ([47dd17d](https://github.com/sethvoltz/totornot/commit/47dd17dfe22bea494540ab7f2239fa7ea48930ed))
* resolve TypeScript errors ([2d62707](https://github.com/sethvoltz/totornot/commit/2d627077412d8bf39a4e0d102fd1497a797b42a9))
* update elo.ts to match test expectations (add optional kFactor param) ([c0f4a2c](https://github.com/sethvoltz/totornot/commit/c0f4a2c41be003d315f6b29f86b1025f5b291a42))
* use disabled instead of loading prop to prevent animation breakage ([#10](https://github.com/sethvoltz/totornot/issues/10)) ([8ecbb83](https://github.com/sethvoltz/totornot/commit/8ecbb831a79a0a13827fb8f5efb0f761225cdb96))
