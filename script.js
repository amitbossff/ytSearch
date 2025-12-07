let selectedFilter = null;
const popup = document.getElementById("popup");
const searchBox = document.getElementById("searchBox");

searchBox.addEventListener("input", () => {
  if (searchBox.value.trim() !== "") {
    popup.style.display = "flex";
  }
});

function closePopup() {
  popup.style.display = "none";
}

function selectFilter(type) {
  selectedFilter = type;

  document.querySelectorAll(".option").forEach(opt => opt.classList.remove("active"));
  event.target.classList.add("active");
}

function applyFilter() {
  if (!searchBox.value.trim()) return;

  const query = encodeURIComponent(searchBox.value.trim());

  let filterCode = "";
  switch (selectedFilter) {
    case "hour": filterCode = "EgIIAQ%3D%3D"; break;
    case "today": filterCode = "EgQIAhAB"; break;
    case "week": filterCode = "EgQIAxAB"; break;
    case "month": filterCode = "EgQIBBAB"; break;
  }

  const url = `https://www.youtube.com/results?search_query=${query}&sp=${filterCode}`;

  window.open(url, "_blank");

  closePopup();
  searchBox.value = "";
  selectedFilter = null;
}
