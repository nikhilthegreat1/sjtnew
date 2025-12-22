let allLinks = [];
let visibleCount = 0;
const POSTS_PER_LOAD = 9;

// FETCH FARIDABAD LINKS
fetch("faridabad-links.txt?v=" + Date.now())
  .then(res => res.text())
  .then(text => {
    allLinks = text
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);
    renderNext();
  });

function renderNext() {
  const container = document.getElementById("links-feed");
  const next = allLinks.slice(visibleCount, visibleCount + POSTS_PER_LOAD);

  next.forEach(link => {
    const card = document.createElement("div");
    card.className = "news-card";

    let embed = "";

    // YOUTUBE
    if (link.includes("youtu")) {
      const id = link.includes("youtu.be")
        ? link.split("/").pop()
        : new URL(link).searchParams.get("v");

      embed = `<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`;
    }

    // FACEBOOK
    else if (link.includes("facebook.com")) {
      embed = `
        <div class="fb-post"
          data-href="${link}"
          data-show-text="true"></div>`;
    }

    card.innerHTML = `
      <div class="embed-box">${embed}</div>
      <div class="news-time">⏱ ${new Date().toLocaleString("hi-IN")}</div>
    `;

    container.appendChild(card);
  });

  visibleCount += POSTS_PER_LOAD;
}

// LOAD MORE BUTTON
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement("button");
  btn.textContent = "और खबरें देखें";
  btn.onclick = renderNext;
  document.querySelector(".container").appendChild(btn);
});
