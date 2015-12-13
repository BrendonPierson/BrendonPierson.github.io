var hamburger = document.getElementById("hamburger");
var navLinks = document.getElementById("mobileNav");

hamburger.onclick = function(e) {
  if(navLinks.classList.contains("close")){
    hamburger.classList.add('open');
    hamburger.classList.remove('close');
    navLinks.classList.add('open');
    navLinks.classList.remove('close');
  } else {
    hamburger.classList.remove('open');
    hamburger.classList.add('close');
    navLinks.classList.remove('open');
    navLinks.classList.add('close');
  }
}
