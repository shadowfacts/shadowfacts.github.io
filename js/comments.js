"use strict";

(() => {
	const headers = new Headers({ "Accept" : "application/vnd.github.v3.html+json" });
	const token = getCookie("ghtoken");
	if (token != null) {
		headers.append("Authorization", `token ${token}`);
	}
	const avatarRes = window.devicePixelRatio && window.devicePixelRatio > 1.3 ? 40 : 20;
	fetch(`https://api.github.com/repos/shadowfacts/shadowfacts.github.io/issues/${issueId}/comments?per_page=100`, { headers: headers })
		.then(res => res.json())
		.then(comments => {
			const list = document.getElementsByClassName("comments-list")[0];

			comments.forEach(it => {
				const date = new Date(it.created_at).toLocaleString("en-us", {
					month: "short",
					day: "numeric",
					year: "numeric"
				});

				const data = 
				`
				<div class="comment">
					<div class="comment-details">
						<img src="${it.user.avatar_url}&s=${avatarRes}" alt="${it.user.login}" class="comment-user-avatar">
						<p class="comment-info">
							<a href="${it.user.html_url}" class="comment-user-name">${it.user.login}</a>
							on
							<a href="${it.html_url}" class="comment-date">${date}</a>
						</p>
					</div>
					<div class="comment-body">
						${it.body_html}
					</div>
				</div>
				`;

				list.insertAdjacentHTML("beforeend", data);
			});
		});

	if (token != null) {
		document.getElementById("comment-form").setAttribute("onsubmit", `return submitComment(document.getElementById('comment-body').value, getCookie('ghtoken'))`);
	} else if (window.location.hash.length > 0) { // comment submit in progress
		const obj = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
		window.location.hash = "";
		setCookie("ghtoken", obj.token);
		submitComment(obj.comment, obj.token);
	}
})();

function submitComment(comment, token) {
	fetch(`https://api.github.com/repos/shadowfacts/shadowfacts.github.io/issues/${issueId}/comments`, {
		method: "post",
		headers: new Headers({ "Authorization": `token ${token}` }),
		body: JSON.stringify({ body: comment })
	}).then(res => {
		window.location.reload();
	}).catch(console.log);
}