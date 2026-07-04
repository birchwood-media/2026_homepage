const toggle = document.getElementById("themeToggle");
const icons = document.getElementById("modeIcons");
const body = document.body;

const openAbout = document.getElementById("openAbout");
const openImpressum = document.getElementById("openImpressum");
const openWelcome = document.getElementById("openWelcome");
const openAllVideos = document.getElementById("openAllVideos");

const overlay = document.getElementById("overlay");
const overlayFrame = document.getElementById("overlayFrame");
const overlayTitle = document.getElementById("overlayTitle");
const closeOverlay = document.getElementById("closeOverlay");
const windowFrame = document.getElementById("windowFrame");

const colors = ["green", "yellow", "blue", "red", "magenta"];
const stammElements = document.querySelectorAll(".stamm");

let dark = localStorage.getItem("theme") === "dark";
let isClosing = false;

/* ----------------------
   THEME
---------------------- */

function syncThemeUI() {
  if (dark) {
    body.classList.add("dark-mode");
    icons.textContent = "✸⬅○";
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    icons.textContent = "✸➡○";
    localStorage.setItem("theme", "light");
  }

  applyThemeToIframe();
}

toggle.addEventListener("click", () => {
  dark = !dark;
  syncThemeUI();
});

syncThemeUI();

/* ----------------------
   STÄMME
---------------------- */

stammElements.forEach((stamm, index) => {
  stamm.addEventListener("click", () => {
    const soundPath = stamm.dataset.sound;
    const sound = new Audio(soundPath);
    sound.play();

    stamm.style.color = colors[index];

    setTimeout(() => {
      stamm.style.color = "";
    }, 1000);
  });
});

/* ----------------------
   OVERLAY
---------------------- */

function reloadIframe(page) {
  overlayFrame.classList.remove("ready");
  overlayFrame.src = page + "?reload=" + Date.now();
}

function reactWindow() {
  windowFrame.classList.remove("switching");
  void windowFrame.offsetWidth;
  windowFrame.classList.add("switching");
}

function openOverlay(page) {
  if (isClosing) return;

  overlayTitle.textContent = "Lädt …";

  if (overlay.classList.contains("active")) {
    reactWindow();
    reloadIframe(page);
    return;
  }

  overlay.classList.remove("closing");
  windowFrame.classList.remove("closing");

  overlay.classList.add("active", "opening");
  windowFrame.classList.add("opening");

  reloadIframe(page);
}

function closeOverlayWindow() {
  if (isClosing) return;
  isClosing = true;

  overlay.classList.remove("opening");
  windowFrame.classList.remove("opening");

  overlay.classList.add("closing");
  windowFrame.classList.add("closing");
}

function finishCloseOverlay() {
  overlay.classList.remove("active", "closing", "opening");
  windowFrame.classList.remove("closing", "opening", "switching");
  overlayFrame.classList.remove("ready");
  overlayFrame.src = "";
  overlayTitle.textContent = "";
  isClosing = false;
}

function applyThemeToIframe() {
  try {
    const iframeDoc = overlayFrame.contentDocument || overlayFrame.contentWindow.document;
    if (!iframeDoc || !iframeDoc.body) return;

    if (body.classList.contains("dark-mode")) {
      iframeDoc.documentElement.classList.add("dark-mode");
      iframeDoc.body.classList.add("dark-mode");
    } else {
      iframeDoc.documentElement.classList.remove("dark-mode");
      iframeDoc.body.classList.remove("dark-mode");
    }
  } catch (e) {
    console.warn("Konnte Theme nicht ins iframe übertragen:", e);
  }
}

function updateOverlayTitleFromIframe() {
  try {
    const iframeDoc = overlayFrame.contentDocument || overlayFrame.contentWindow.document;
    if (!iframeDoc) return;

    const pageTitle = iframeDoc.title?.trim();
    overlayTitle.textContent = pageTitle || "Fenster";
  } catch (e) {
    console.warn("Konnte Titel aus iframe nicht lesen:", e);
    overlayTitle.textContent = "Fenster";
  }
}

overlayFrame.addEventListener("load", () => {
  applyThemeToIframe();
  updateOverlayTitleFromIframe();

  requestAnimationFrame(() => {
    overlayFrame.classList.add("ready");
  });
});

windowFrame.addEventListener("animationend", (event) => {
  if (event.animationName === "windowClose") {
    finishCloseOverlay();
  }

  if (event.animationName === "windowOpen") {
    windowFrame.classList.remove("opening");
    overlay.classList.remove("opening");
  }

  if (event.animationName === "windowSwitch") {
    windowFrame.classList.remove("switching");
  }
});

/* ----------------------
   BUTTONS
---------------------- */

openAbout.addEventListener("click", () => {
  openOverlay("about.html");
});

openImpressum.addEventListener("click", () => {
  openOverlay("impressum.html");
});

openWelcome.addEventListener("click", () => {
  openOverlay("welcome.html");
});

openAllVideos.addEventListener("click", () => {
  openOverlay("allvideos.html");
});

closeOverlay.addEventListener("click", () => {
  closeOverlayWindow();
});

overlayTitle.addEventListener("click", () => {
  try {
    if (overlayFrame.contentWindow) {
      overlayFrame.contentWindow.location.reload();
    }
  } catch (e) {
    const currentSrc = overlayFrame.src;
    overlayFrame.src = "";
    overlayFrame.src = currentSrc;
  }
});