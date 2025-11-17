---
title: "Q&A"
description: "Frequently asked questions about FileBrowser Quantum"
icon: "question_answer"
---

Common questions and answers about FileBrowser Quantum.

## Can you add FileBrowser Quantum features to the original file browser?

This "Quantum" version fork was created because I wanted certain features that are a dramatic and opinionated departure from the OG filebrowser. If you look at the original filebrowser repo pull requests, you will find many basic features remain open for many months or years with very little attention.

If the original filebrowser maintainers were more active and if I didn't have to worry about spending months or years playing politics about the consequences of these drastic changes, I would contribute to the original repository.

However, **I will not make modifications to the original filebrowser**, for these reasons:

1. My changes are opinionated and I want full control over the experience (and consequences) of the changes. For example I removed the terminal, runners, command line flags, and more. These are changes that would probably be highly contested. I think the experience is better with these changes.
2. Contributing to that open source project takes a long time, I may never see my changes make it in and I don't want to waste my time trying for years. I only have so much time.
3. This project was originally a fork, but that quickly changed. There are hundreds of thousands of changes and complete departures from the original codebase. I can't simply "port" the features I write on this repo over to the OG file browser.

Both of these repos being open source means YOU can migrate these features if you want! Feel free to spend the effort and do so for the community. I am not the only one capable of doing it and I encourage this if you have the time, energy, and knowhow to do it.

## I notice a lot of things that don't work like the original file browser repo. How can I get this fixed?

Please open issues and/or pull requests from a forked repo if you notice issues that should be fixed. Some changes are intentional, and I may have left things broken. Please let me know, and I will check if it's a deliberate change or a bug.

## Who are the maintainers for FileBrowser Quantum?

Right now, it's just me as a personal hobby and some small contributions from the community. Once I can release a confident, stable version, I plan to publicize this application more on social media. Hopefully, in the future, I could pick up some extra contributors.

If you want to be an "official" contributor, feel free to email me at info@quantumx-apps.com to see about getting contributor access.

## Is there a way to donate or support this project?

I spend a lot of time reviewing dozens of notifications each day for feature requests and bug fixes from the community. If you would like to share your support by donating, there are a couple of options:

1. Donate [via paypal](https://www.paypal.com/donate/?business=W5XKNXHJM2WPE&no_recurring=0&currency_code=USD)
2. Donate via bitcoin: `bc1qm92lhqgrqhdqhfd2rdp94g5gt0gljlh6wu9mt2`

## How can there be so many updates to this repo with so few contributors?

This repo has adopted a rapid development philosophy, unlike the original filebrowser. This comes down to 3 fundamental differences that I designed this repo with from the beginning:

* **Local development is blazingly fast** - [Build times are 10x faster](https://gportal.link/blog/posts/2025/04_typescript_port_go/typescript_go/#filebrowser-quantum-frontend-build-time-mostly-javascript). This is due to several changes that were intentionally made to improve development time. This allows changes to be tested and published for PR's much faster.
* **[Comprehensive tests](https://github.com/gtsteffaniak/filebrowser/blob/main/.github/workflows/pr.yaml)** on every PR to ensure the program works with the changes, testing a variety of configurations. This helps ensure PR's have minimal risk of breaking anything. The most important of these tests are the integration tests, which use Playwright to navigate the UI programmatically. These tests validate that sharing, copying, moving, navigating, and previewing work on every PR.
* **[Promotion workflow](https://github.com/gtsteffaniak/filebrowser/wiki/Contributing)** - Rather than a PR occurring directly against `main`, it goes through a promotion process, which keeps most bugs from surfacing to the releases.

The goal is to allow for rapid changes that can be tested easily locally and validated automatically. With this process, there is less burden on the developer and contributor. As a result, changes big and small can happen very quickly.

## Is there an email or phone I can contact?

Yes - Please contact info@quantumx-apps.com for any off-GitHub topics. If it's related to a specific application or repo, such as this filebrowser, please open an issue or pull request instead. Email is only for correspondence unrelated to technical changes or issues.

## Can I fork this repo and use it?

This repo has the same license as the original filebrowser, apache-2.0. Feel free to use in any way that follows the license. I have no issues with anything personally -- it's open source, please do as you like. However, since this is a fork of the OG repo, I am not sure what the consequences are for a fork of this repo.

## Are there plans to charge for this application?

No, it will always be free to use.

## Will there ever be commercial advertisements when using this application?

No, it will never include ads for paid software.

## Is there a Discord for this fork?

Not yet, generally most interactions should happen on GitHub for now.

