var scroll = false;
function start(e){
  if(scroll){
    e.getElementsByClassName("marquee")[0].classList.remove("marquee-scroll");
    scroll = false;
  }else{
    e.getElementsByClassName("marquee")[0].classList.add("marquee-scroll");
    scroll = true;
  }

}
