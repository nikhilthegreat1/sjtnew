

let allLinks = [];
let visibleCount = 0;
const POSTS_PER_LOAD = 9;
// AUTO LINK BASED NEWS SYSTEM

fetch("links.txt")
  .then(response => response.text())
  .then(text => {
    const links = text
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);

      allLinks = links;
      renderNextPosts();
      
  })
  .catch(err => console.error("Link file error:", err));

function renderLinks(links) {
  const container = document.getElementById("links-feed");
  if (!container) return;

 // container.innerHTML = "";

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
   // FACEBOOK (OFFICIAL SDK METHOD)
else if (link.includes("facebook.com")) {
    embedHTML = `
      <div class="fb-post"
        data-href="${link}"
        data-width="500"
        data-show-text="true">
      </div>
    `;
  }
  

    card.innerHTML = `
      <div class="embed-box">${embedHTML}</div>
      <div class="news-time">
        ⏱ ${new Date().toLocaleString("hi-IN")}
      </div>
    `;

    container.appendChild(card);
    if (window.FB) {
        FB.XFBML.parse();
      }
  });
}


// FOOTER YEAR
document.getElementById("year-now").textContent = new Date().getFullYear();

// ===== PDF POPUP =====
// ===== PDF POPUP (SHOW ONCE IN 10 HOURS) =====
document.addEventListener("DOMContentLoaded", () => {

    const openPdfBtn = document.getElementById("openPdfBtn");
    const closePdfBtn = document.getElementById("closePdfBtn");
    const pdfPopup = document.getElementById("pdfPopup");
  
    const POPUP_KEY = "pdfPopupLastShown";
    const TEN_HOURS = 10 * 60 * 60 * 1000; // 10 hours
  
    function shouldShowPopup() {
      const lastShown = localStorage.getItem(POPUP_KEY);
      if (!lastShown) return true;
  
      return (Date.now() - lastShown) > TEN_HOURS;
    }
  
    function showPopup() {
      if (pdfPopup) {
        pdfPopup.style.display = "flex";
        localStorage.setItem(POPUP_KEY, Date.now());
      }
    }
  
    // ✅ AUTO OPEN (only if 10 hours passed)
    if (shouldShowPopup()) {
      showPopup();
    }
  
    if (openPdfBtn) {
      openPdfBtn.onclick = () => {
        showPopup();
      };
    }
  
    if (closePdfBtn) {
      closePdfBtn.onclick = () => {
        pdfPopup.style.display = "none";
      };
    }
  
  });
  
  // ===== DATE & TIME =====
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
  setInterval(updateDateTime, 60000); // update every minute
  
  function renderNextPosts() {
    const nextLinks = allLinks.slice(
      visibleCount,
      visibleCount + POSTS_PER_LOAD
    );
  
    renderLinks(nextLinks);
    visibleCount += POSTS_PER_LOAD;
  
    // Hide button if no more posts
    if (visibleCount >= allLinks.length) {
      const btn = document.getElementById("loadMoreBtn");
      if (btn) btn.style.display = "none";
    }
  }
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
    container.after(btn);
  });
    

