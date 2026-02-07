const searchBox = document.getElementById("searchBox");
const pasteBtn = document.getElementById("pasteBtn");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const filterToggle = document.getElementById("filterToggle");
const toast = document.getElementById("toast");

let currentFilter = "EgIIAQ%3D%3D"; // Default: Last Hour
let filterType = "Last Hour";

function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function doSearch(val) {
  if (!val || val.trim() === "") return;
  const query = encodeURIComponent(val.trim());
  const finalUrl = `https://www.youtube.com/results?search_query=${query}&sp=${currentFilter}`;
  
  searchBox.value = ""; 
  window.location.href = finalUrl;
}

filterToggle.addEventListener("click", () => {
  if (filterType === "Last Hour") {
    currentFilter = "EgQIAhAB"; // Today code
    filterType = "Today";
    filterToggle.innerHTML = '<i class="bi bi-clock-history"></i> Switch to Last Hour';
    showToast("Sifted to Today filter");
  } else {
    currentFilter = "EgIIAQ%3D%3D"; // Last Hour code
    filterType = "Last Hour";
    filterToggle.innerHTML = '<i class="bi bi-calendar-event"></i> Switch to Today';
    showToast("Sifted to Last Hour filter");
  }
});

searchBox.addEventListener("input", () => {
  if (searchBox.value.length >= 1) {
    doSearch(searchBox.value);
  }
});

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      searchBox.value = text;
      doSearch(text);
    } else {
      modalOverlay.style.display = "flex";
    }
  } catch (err) {
    modalOverlay.style.display = "flex";
  }
});

closeModal.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") doSearch(searchBox.value);
});