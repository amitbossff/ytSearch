let filter = "EgIIAQ%3D%3D";
const q = document.getElementById("q");
const clipModal = document.getElementById("clipModal");

document.querySelectorAll(".filter").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.getAttribute("data");
    navigator.vibrate && navigator.vibrate(10);
  };
});

function openModal(){
  clipModal.style.display="flex";
}
function closeModal(){
  clipModal.style.display="none";
}

document.getElementById("pasteBtn").onclick = async () => {
  try{
    const text = await navigator.clipboard.readText();
    if(text && text.trim()){
      q.value = "";
      go(text.trim());
    }else{
      openModal();
    }
  }catch{
    openModal();
  }
};

q.addEventListener("input",e=>{
  const v = e.target.value.trim();
  if(v.length>=1){
    q.value="";
    go(v);
  }
});

function go(v){
  navigator.vibrate && navigator.vibrate(10);
  setTimeout(()=>{
    location.href =
      `https://www.youtube.com/results?search_query=${encodeURIComponent(v)}&sp=${filter}`;
  },260);
}
