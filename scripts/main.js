var hamburger = document.getElementById("hamburger");

hamburger.onclick = function() {
  var current = document.getElementById("mobileNav").style.display;
  if(current === "none"){
    document.getElementById("mobileNav").style.display = "flex";
    document.getElementById("mobileNav").className = "topNav-links-div";
  } else {
    document.getElementById("mobileNav").style.display = "none";
    document.getElementById("mobileNav").className = "";

  }
}