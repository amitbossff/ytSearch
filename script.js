let filter="EgIIAQ%3D%3D";
const q=document.getElementById("q");
const modal=document.getElementById("clipModal");

// Filters
document.querySelectorAll(".filter").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    filter=btn.dataset.value || btn.getAttribute("data");
    navigator.vibrate && navigator.vibrate(10);
  };
});

// Modal
function openModal(){ modal.style.display="flex"; }
function closeModal(){ modal.style.display="none"; }

// Paste button
document.getElementById("pasteBtn").onclick=async()=>{
  try{
    const t=await navigator.clipboard.readText();
    if(t && t.trim()){
      q.value="";
      go(t.trim());
    }else openModal();
  }catch{ openModal(); }
};

// 1 character = redirect + auto clear
q.addEventListener("input",e=>{
  const v=e.target.value.trim();
  if(v.length>=1){
    q.value="";
    go(v);
  }
});

function go(v){
  navigator.vibrate && navigator.vibrate(10);
  setTimeout(()=>{
    location.href=
      `https://www.youtube.com/results?search_query=${encodeURIComponent(v)}&sp=${filter}`;
  },260);
}
