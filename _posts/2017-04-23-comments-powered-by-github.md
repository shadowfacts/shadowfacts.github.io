---
layout: post
title: "Comments Powered by GitHub"
date: 2017-04-23 09:05:42 -0400
category: meta
issue_id: 7
---

After seeing [this article][orig] the other morning about replacing the Disqus comments on a blog powered by a static site generator (like this one) with comments backed by a GitHub issue and some front-end JavaScript to load and display them, I thought it would be fun to implement something similar. First I only built the code for displaying comments, similar to the aforementioned article, but I decided to take it one step further by allowing users to submit comments directly from my site.

You might be wondering, *Why even use weird, front-end comments like this when you could just use a database on the backend and generate the page dynamically?* Well, there are a couple reasons. 1) It's a lot simpler to code (I don't have to handle any of the backend stuff like storage/moderation tools/etc.) and 2) my site can remain entirely static. This second reason was the key factor for me. Being static allows my site to be hosted for free on [GitHub Pages](https://pages.github.com/) so I don't have to handle any of the server-side stuff myself. It also makes the site ridiculously fast. A draft of this post has all the content and styles loaded within ~150ms and has the comments loaded after ~300ms.



So, how did I implement it? Well the first part is fairly simple and based on the [original article][orig]. It simply sends a request to the GitHub API [endpoint](https://developer.github.com/v3/issues/comments/#list-comments-on-an-issue), parses the resulting JSON, generates some HTML, and injects it back into the page.

The second part is a bit more complicated, as it handles authentication with the GitHub API and posting comments directly from my site. Since this is a fair bit more complicated with several possible paths to the desired behavior, I'll go through this (twice, the reasoning for which will become clear soon) as would actually happen: 

1. The user  enters some comment into the textarea and clicks the submit button. At this point, since the user's never submitted a comment via the website before, we need to authorize with GitHub before we can submit.
2.  When the user clicks the submit button, the forms submits to a separate backend helper application that handles the OAuth authorization flow.
3. The server app then temporarily stores the submitted comment with a random ID and redirects the user to the GitHub authorization page where the user grants access to their account.
4. From there, GitHub redirects back to the helper app with the same random ID and an OAuth code.
5. The helper app then sends a request to GitHub with the OAuth code, client ID, and client secret (this is why the helper is necessary, to keep the secret secret) getting an authorization token in response. 
6. The helper app uses the random ID to retrieve the comment being submitted and the URL being submitted from, redirecting the user back to the original URL with the comment and auth token in the URL hash.
7. The client loads the comment and auth token from the hash and the clears the hash.
8. The auth token is stored in a cookie for future use.
9. Finally, the client then sends a POST request to the GitHub API [endpoint](https://developer.github.com/v3/issues/comments/#create-a-comment) with the comment, issue ID, and the token to submit the comment.

This is the flow for when the client's never submitted a comment before, but as stated in step 8, the auth token is cached on the client, making things simpler the next time someone wants to submit a comment. When the comment submit button is pressed and there is an auth token cached, we simply cancel the form submission and send the POST request to GitHub, submitting the comment.

All of the code for this is open source. The front-end JS is available [here](https://github.com/shadowfacts/shadowfacts.github.io/blob/master/js/comments.js) and the backend GitHub API helper is [here](https://github.com/shadowfacts/gh-comment-poster).

And that's it! So, do you like this system? Hate it? Have suggestions for how it could be improved? Well now you can leave a comment.

[orig]: http://donw.io/post/github-comments/