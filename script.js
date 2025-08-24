// EmailJS init
(function(){ emailjs.init("YOUR_EMAILJS_USER_ID"); })();

// Log function
let intervalId;
const log = msg => {
  const logBox = document.getElementById("log");
  logBox.innerHTML += msg + "<br>";
  logBox.scrollTop = logBox.scrollHeight;
};

// Start button
document.getElementById("startBtn").addEventListener("click", () => {
  const url = document.getElementById("url").value.trim();
  const searchTerm = document.getElementById("search").value.trim();
  const intervalMinutes = parseInt(document.getElementById("interval").value.trim());

  // تحقق صارم من الحقول
  if (!url) {
    alert("Bitte URL eingeben!");
    return;
  }
  if (!searchTerm) {
    alert("Bitte einen Suchbegriff auswählen!");
    return;
  }
  if (isNaN(intervalMinutes) || intervalMinutes <= 0) {
    alert("Bitte ein gültiges Intervall eingeben!");
    return;
  }

  log("Starte Überprüfung...");
  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;

  intervalId = setInterval(async () => {
    log("Überprüfe Webseite...");
    try {
      const res = await fetch(`/check?url=${encodeURIComponent(url)}`);
      const text = await res.text();
      if(text.includes(searchTerm)){
        log("Termin gefunden! Sende E-Mail...");
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
          to_email: document.getElementById("emailTo").value,
          message: `Es gibt einen freien Termin für: ${searchTerm}\nLink: ${url}`
        }).then(() => {
          log("E-Mail gesendet!");
          clearInterval(intervalId);
          document.getElementById("startBtn").disabled = false;
          document.getElementById("stopBtn").disabled = true;
        }).catch(err => log("E-Mail Fehler: "+err));
      } else {
        log("Kein Termin verfügbar.");
      }
    } catch(e){
      log("Fehler: "+e.message);
    }
  }, intervalMinutes*60*1000);
});

// Stop button
document.getElementById("stopBtn").addEventListener("click", () => {
  clearInterval(intervalId);
  log("Überprüfung gestoppt.");
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
});

// Clear log
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("log").innerHTML = "";
});

// Bahn animation
(function () {
  const car = document.getElementById('bahn');
  let x = window.innerWidth - 320;
  let speed = 1.0;
  let dir = -1;
  function loop(){
    const stageW = window.innerWidth;
    x += speed * dir;
    if(x <= 0) dir=1;
    if(x >= stageW-320) dir=-1;
    car.style.transform = `translate(${x}px,30px)`;
    requestAnimationFrame(loop);
  }
  loop();
})();
