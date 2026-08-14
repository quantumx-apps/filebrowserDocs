---
title: "Q&A"
description: "Frequently asked questions about FileBrowser Quantum"
icon: "question_answer"
date: "2025-10-08T14:59:30Z"
lastmod: "2025-11-09T23:00:24Z"
---

Common questions and answers about FileBrowser Quantum.

## Who are the maintainers for FileBrowser Quantum?

There are currently only two official contributors:

1. Graham Steffaniak ([@gtsteffaniak](https://github.com/gtsteffaniak))
2. Kevin B. [@Kurami32](https://github.com/Kurami32)

Graham is the owner of the repo. He originally forked it on June 13, 2023, to begin the total rewrite adventure. He is active on GitHub issues and encourages discussions about the design and direction of the project.

Kevin emerged as an active contributor within the community and was given official contributor access shortly after, simply because of their active involvement and quality contributions. Originally, Kevin's focus was on frontend changes, but recently their contributions have spanned the entire stack. As of July 2026, Kevin has [contributed just as much](https://github.com/gtsteffaniak/filebrowser/graphs/contributors) as Graham.

## Is there a way to donate or support this project?

I spend a lot of time reviewing dozens of notifications each day for feature requests and bug fixes from the community. If you would like to share your support by donating, there are a couple of options:

1. Donate [via PayPal](https://www.paypal.com/donate/?business=W5XKNXHJM2WPE&no_recurring=0&currency_code=USD)
2. Donate via Bitcoin: `bc1qm92lhqgrqhdqhfd2rdp94g5gt0gljlh6wu9mt2`

## How can there be so many updates to this repo with so few contributors?

This repo has adopted a rapid development philosophy, unlike the original FileBrowser. This comes down to three fundamental differences that I designed this repo with from the beginning:

* **Local development is blazingly fast** - [Build times are 10x faster](https://gportal.link/blog/posts/2025/04_typescript_port_go/typescript_go/#filebrowser-quantum-frontend-build-time-mostly-javascript). This is due to several changes that were intentionally made to improve development time. This allows changes to be tested and published for PRs much faster.
* **[Comprehensive tests](https://github.com/gtsteffaniak/filebrowser/blob/main/.github/workflows/pr.yaml)** on every PR to ensure the program works with the changes, testing a variety of configurations. This helps ensure PRs have minimal risk of breaking anything. The most important of these tests are the integration tests, which use Playwright to navigate the UI programmatically. These tests validate that sharing, copying, moving, navigating, and previewing work on every PR.
* **[Promotion workflow](https://github.com/gtsteffaniak/filebrowser/wiki/Contributing)** - Rather than a PR occurring directly against `main`, it goes through a promotion process, which keeps most bugs from surfacing in the releases.

The goal is to allow for rapid changes that can be tested easily locally and validated automatically. With this process, there is less burden on the developer and contributor. As a result, changes big and small can happen very quickly.

## Is there an email or phone number I can contact?

Yes — please contact info@quantumx-apps.com for any off-GitHub topics. If it's related to a specific application or repo, such as this FileBrowser, please open an issue or pull request instead. Email is only for correspondence unrelated to technical changes or issues.

## Can I fork this repo and use it?

This repo has the same license as the original FileBrowser, Apache-2.0. Feel free to use it in any way that follows the license. I have no issues with anything personally — it's open source, please do as you like. However, since this is a fork of the OG repo, I am not sure what the consequences would be for a fork of this repo.

## Are there plans to charge for this application?

No, it will always be free to use.

## Will there ever be commercial advertisements when using this application?

No, it will never include ads for paid software. Also, any solicitation PRs, issues, or discussions will result in an immediate ban on that account's GitHub interactions. This repo will never be a place for advertising.

## Is there a Discord for this fork?

Not yet; generally, most interactions should happen on GitHub for now.

