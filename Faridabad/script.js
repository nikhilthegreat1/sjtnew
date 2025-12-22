/*************************
 FARIDABAD NEWS SCRIPT
**************************/

let allLinks = [];
let visibleCount = 0;
const POSTS_PER_LOAD = 9;

/* =====================
   FETCH FARIDABAD LINKS
===================== */
fetch("links.txt?v=" + Date.now())
  .then(response => response.text())
  .then(text => {
    allLinks = text
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);

    renderNextPosts();
  })
  .catch(err => console.error("Faridabad links error:", err));

/* =====================
   RENDER POSTS
===================== */
function renderLinks(links) {
  const container = document.getElementById("links-feed");
  if (!container) return;

  links.forEach(link => {
    const card = document.createElement("div");
    card.className = "news-card";

    let embedHTML = "";

    // YOUTUBE
    if (link.includes("youtube.com") || link.includes("youtu.be")) {
      try {
        const videoId = link.includes("youtu.be")
          ? link.split("/").pop()
          : new URL(link).searchParams.get("v");

        if (!videoId) return;

        embedHTML = `
          <iframe
            src="https://www.youtube.com/embed/${videoId}"
            allowfullscreen
          ></iframe>`;
      } catch (e) {
        console.error("Invalid YouTube link:", link);
        return;
      }
    }

    // FACEBOOK
    else if (link.includes("facebook.com")) {
      embedHTML = `
        <div class="fb-post"
          data-href="${link}"
          data-width="500"
          data-show-text="true">
        </div>`;
    }

    card.innerHTML = `
      <div class="embed-box">${embedHTML}</div>
      <div class="news-time">
        ⏱ ${new Date().toLocaleString("hi-IN")}
      </div>
    `;

    container.appendChild(card);

    // Re-parse FB embeds
    if (window.FB) {
      FB.XFBML.parse();
    }
  });
}

/* =====================
   LOAD MORE SYSTEM
===================== */
function renderNextPosts() {
  const nextLinks = allLinks.slice(
    visibleCount,
    visibleCount + POSTS_PER_LOAD
  );

  renderLinks(nextLinks);
  visibleCount += POSTS_PER_LOAD;

  if (visibleCount >= allLinks.length) {
    const btn = document.getElementById("loadMoreBtn");
    if (btn) btn.style.display = "none";
  }
}

/* =====================
   LOAD MORE BUTTON
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement("button");
  btn.id = "loadMoreBtn";
  btn.textContent = "और खबरें देखें";
  btn.style.cssText = `
    display:block;
    margin:30px auto;
    padding:10px 22px;
    border:none;
    border-radius:10px;
    background:#b30000;
    color:#fff;
    font-size:15px;
    cursor:pointer;
  `;

  btn.onclick = renderNextPosts;

  const container = document.getElementById("links-feed");
  if (container) container.after(btn);
});

/* =====================
   DATE & TIME
===================== */
function updateDateTime() {
  const now = new Date();

  const dateEl = document.getElementById("date-now");
  const timeEl = document.getElementById("time-now");

  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
}

updateDateTime();
setInterval(updateDateTime, 60000);

/* =====================
   FOOTER YEAR
===================== */
const yearEl = document.getElementById("year-now");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* =====================
   PDF POPUP (OPTIONAL)
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openPdfBtn");
  const closeBtn = document.getElementById("closePdfBtn");
  const popup = document.getElementById("pdfPopup");

  if (openBtn && popup) {
    openBtn.onclick = () => popup.style.display = "flex";
  }

  if (closeBtn && popup) {
    closeBtn.onclick = () => popup.style.display = "none";
  }
});
