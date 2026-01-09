
function searchYT() {
  const input = document.getElementById("query");
  const q = input.value.trim();

  if (!q) {
    alert("Please enter a search keyword");
    return;
  }

  const encoded = encodeURIComponent(q);

  const url =
    `https://www.youtube.com/results?search_query=${encoded}&sp=EgIIAQ%3D%3D`;

  window.location.href = url;
}

// Clear input
const inputEl = document.getElementById("query");
const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  inputEl.value = "";
  inputEl.focus();
});

// Register service worker (SAFE)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}