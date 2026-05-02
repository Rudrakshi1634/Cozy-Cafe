let time = 1500;
let running = false;
let interval = null;

function updateDisplay(){
  let m = Math.floor(time/60);
  let s = time % 60;

  if(s < 10) s = "0" + s;

  document.getElementById("timer").innerText = m + ":" + s;
}

function startTimer(){

  if(running) return;

  running = true;

  interval = setInterval(function(){

    if(time > 0){

      time--;
      updateDisplay();

      document.getElementById("status").innerText = "🔥 Baking...";

    } else {

      clearInterval(interval);
      running = false;

      document.getElementById("status").innerText = "🍰 Done!";

    }

  },1000);
}

function startBreak(){

  clearInterval(interval);

  time = 300;

  interval = setInterval(function(){

    if(time > 0){

      time--;
      updateDisplay();

      document.getElementById("status").innerText = "☕ Relax...";

    } else {

      clearInterval(interval);

      document.getElementById("status").innerText = "Break over";

    }

  },1000);
}