---
layout: post
title: "The Pretty Good Minor Update"
date: 2017-02-17 14:30:42 -0400
category: meta
---

It's been about six months since the last time I redesigned the site, and while I didn't want to redesign it yet again, I felt it could use a little update to make sure everything's still good.

After reading this [blog post](http://jacquesmattheij.com/the-fastest-blog-in-the-world) about optimizing sites (specifically using a static site generator, like this one does) that was posted on HN, I got to thinking about optimizing my site. I tested my site on Google's [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights) and got a mediocre score (I don't recall the exact number, but it was in the 70s or 80s).  I haven't gone anywhere near as all-out with the optimization as the blog post described, but I'll still go over the couple things I did do:

- Removing custom fonts. The only custom font I previously used was [Hack](https://github.com/chrissimpkins/Hack) for code blocks, so removing that shaved off several extra requests and quite a bit of time without changing much.
- Replace [js-cookie](https://github.com/js-cookie/js-cookie) with a [couple functions](https://github.com/shadowfacts/shadowfacts.github.io/blob/master/_includes/head.html#L17-L34) included in the inline script, saving ~2 kilobytes and an additional HTTP request.
- [CloudFlare](https://www.cloudflare.com) provides a number of optimizations (caching and HTML/CSS minification).



Additionally, there's now a fallback `<noscript>` tag so that if the viewer has JavaScript disabled, the site will still look normal (JavaScript being disabled does mean the theme can't be changed, so the user will always see the light theme). And lastly, there's now a custom 404 page so if you end up at the wrong URL, you'll see something nicer than the default 404 page for GitHub Pages.