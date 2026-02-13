(function() {
  const searchBox = document.getElementById("searchBox");
  const clearBtn = document.getElementById("clearBtn");
  const pasteBtn = document.getElementById("pasteBtn");
  const searchBtn = document.getElementById("searchBtn");
  const popupOverlay = document.getElementById("popupOverlay");
  const popupClose = document.getElementById("popupClose");
  const modeButtons = document.querySelectorAll('.mode-btn');
  const dailyCountSpan = document.getElementById('dailyCount');

  let currentMode = "hour";
  let inputTimeout = null;
  let hasSearched = false;
  let isRedirecting = false;

  const modeFilters = {
    hour: "EgIIAQ%3D%3D",
    today: "EgIIAg%3D%3D",
    normal: ""
  };

  function getDailySearchCount() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailySearchData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === today) return data.count;
      } catch (e) {}
    }
    return 0;
  }

  function incrementDailySearchCount() {
    const today = new Date().toDateString();
    let currentCount = getDailySearchCount();
    currentCount++;
    localStorage.setItem('dailySearchData', JSON.stringify({
      date: today,
      count: currentCount
    }));
    updateDailyCountDisplay();
    return currentCount;
  }

  function updateDailyCountDisplay() {
    dailyCountSpan.textContent = getDailySearchCount();
    dailyCountSpan.style.transform = 'scale(1.2)';
    setTimeout(() => {
      dailyCountSpan.style.transform = 'scale(1)';
    }, 150);
  }

  function checkAndResetDaily() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailySearchData');
    if (!stored) {
      localStorage.setItem('dailySearchData', JSON.stringify({ date: today, count: 0 }));
    } else {
      try {
        const data = JSON.parse(stored);
        if (data.date !== today) {
          localStorage.setItem('dailySearchData', JSON.stringify({ date: today, count: 0 }));
        }
      } catch (e) {
        localStorage.setItem('dailySearchData', JSON.stringify({ date: today, count: 0 }));
      }
    }
    updateDailyCountDisplay();
  }

  const canPaste = () => navigator.clipboard && typeof navigator.clipboard.readText === "function";

  function setActiveMode(mode) {
    modeButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    currentMode = mode;
    localStorage.setItem('preferredMode', mode);
  }

  function updateClearButton() {
    if (searchBox.value.trim().length > 0 && !isRedirecting) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  function clearSearch() {
    if (isRedirecting) return;
    searchBox.value = "";
    hasSearched = false;
    updateClearButton();
    searchBox.focus();
  }

  function openYouTubeSearch(query, mode) {
    const filter = modeFilters[mode];
    const encodedQuery = encodeURIComponent(query);
    let youtubeUrl;
    
    if (filter) {
      youtubeUrl = `https://www.youtube.com/results?search_query=${encodedQuery}&sp=${filter}`;
    } else {
      youtubeUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;
    }
    
    window.location.href = youtubeUrl;
  }

  function doSearch() {
    const value = searchBox.value.trim();
    if (!value || isRedirecting) return;

    hasSearched = true;
    isRedirecting = true;
    
    incrementDailySearchCount();

    pasteBtn.classList.add('redirecting');
    pasteBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> ';
    pasteBtn.disabled = true;
    searchBtn.disabled = true;
    
    clearBtn.classList.add('hidden');
    
    setTimeout(() => {
      openYouTubeSearch(value, currentMode);
    }, 100);
  }

  searchBox.addEventListener("input", () => {
    updateClearButton();
    if (inputTimeout) clearTimeout(inputTimeout);
    if (!isRedirecting) {
      hasSearched = false;
      inputTimeout = setTimeout(() => {
        if (searchBox.value.trim().length >= 1) {
          doSearch();
        }
      }, 400);
    }
  }, { passive: true });

  searchBox.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isRedirecting) {
        hasSearched = false;
        doSearch();
      }
    }
  });

  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearSearch();
  });

  searchBtn.addEventListener("click", () => {
    if (isRedirecting) return;
    searchBtn.style.transform = "scale(0.96)";
    setTimeout(() => searchBtn.style.transform = "", 100);
    
    const value = searchBox.value.trim();
    if (value) {
      hasSearched = false;
      doSearch();
    } else {
      searchBox.style.borderColor = '#ff4d4d';
      setTimeout(() => {
        searchBox.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      }, 300);
    }
  });

  pasteBtn.addEventListener("click", async () => {
    if (isRedirecting) return;
    
    if (!canPaste()) {
      popupOverlay.style.display = "flex";
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim() && !isRedirecting) {
        searchBox.value = text.trim();
        hasSearched = false;
        updateClearButton();
        doSearch();
      }
    } catch (err) {
      popupOverlay.style.display = "flex";
    }
  });

  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const mode = this.dataset.mode;
      setActiveMode(mode);
    });
  });

  popupClose.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) popupOverlay.style.display = "none";
  });

  document.addEventListener('DOMContentLoaded', () => {
    checkAndResetDaily();
    const savedMode = localStorage.getItem('preferredMode');
    if (savedMode && modeFilters[savedMode]) {
      setActiveMode(savedMode);
    } else {
      setActiveMode('hour');
    }
    searchBox.value = "";
    hasSearched = false;
    isRedirecting = false;
    updateClearButton();
    searchBox.focus();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      pasteBtn.classList.remove('redirecting');
      pasteBtn.innerHTML = '<i class="bi bi-clipboard"></i> Paste';
      pasteBtn.disabled = false;
      searchBtn.disabled = false;
      isRedirecting = false;
      updateClearButton();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && document.activeElement !== searchBox) {
      e.preventDefault();
      if (!isRedirecting) {
        pasteBtn.click();
      }
    }
    if (!isRedirecting) {
      if (e.key === '1') setActiveMode('hour');
      else if (e.key === '2') setActiveMode('today');
      else if (e.key === '3') setActiveMode('normal');
    }
  });
})();