var hamburger = document.getElementById("hamburger");

hamburger.onclick = function() {
  var current = document.getElementById("mobileNav").style.display;
  if(current === "none"){
    document.getElementById("mobileNav").className = "topNav-links-div topNav-links-div-show";
  } else {
    document.getElementById("mobileNav").className = "topNav-links-div topNav-links-div-hide";
  }
}