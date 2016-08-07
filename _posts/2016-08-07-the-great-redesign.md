---
layout: post
title: "The Great Redesign"
date: 2016-08-07 15:39:48 -0400
category: meta
---

Welcome to the fourth iteration of my website. I'm stil using Jekyll, however I've rewritten most of the styles from scratch. This theme is based on the [Hacker theme][HackerHexo] for [Hexo][] which is turn based on the [Hacker WordPress theme][HackerWP] but it has some notable differences.

### 1\. It's built for Jekyll.

Because Jekyll (and more specifically, GitHub Pages) uses Sass instead of [Styl][] like Hacker, all of the styles had to be rewritten from scratch in SCSS. Most of the original [Minima][] styles were scrapped, except for a couple of code styling details and the footer design.

### 2\. It has a dark theme

This is accomplished storing the current them (`dark` or `light`) in a cookie, reading it in the head, and writing a `<link>` element based on the the value of the theme. All the styles are stored in `_sass/theme.scss` and the `css/light.scss` and `css/dark.scss` files store the variable definitions for all the colors used in the theme. Jekyll then compiles the two main SCSS files into two CSS files that each contain [Normalize.css][Normalize], the theme (compiled from the variable definitions), and the [Darcula][RougeDarcula] syntax highlighting theme.

While this does increase the load time and isn't best practice, I think providing the option of a dark theme (especially when the deafult theme is incredibly light (the majority of the page is pure white (ooh, tripple nested parentheses))) outweights the cost. Besides, when testing locally the entire script loading and executiononly cost 5 miliseconds, completely unnoticable.

The selector in the third column of the footer simply updates the cookie value based on the checkbox status and reloads the page via `window.location.reload()` triggering the changed theme CSS to be loaded.

[HackerHexo]: https://github.com/CodeDaraW/Hacker
[Hexo]: https://hexo.io/
[HackerWP]: https://wordpress.org/themes/hacker/
[Styl]: https://github.com/tj/styl
[Minima]: https://github.com/jekyll/minima
[Normalize]: https://necolas.github.io/normalize.css/
[RougeDarcula]: https://github.com/shadowfacts/RougeDarcula
