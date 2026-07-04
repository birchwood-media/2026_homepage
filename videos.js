const container = document.getElementById("videosContainer");
const viewer = document.getElementById("videoViewer");

async function loadVideos() {
  try {
    const response = await fetch("videos.json");
    const videos = await response.json();

    container.innerHTML = "";

    videos.forEach(video => {
      const card = document.createElement("button");
      card.className = "video-card";
      card.type = "button";

 card.innerHTML = `
  <img class="video-thumb" src="${video.thumbnailUrl}" alt="${video.title}">
  <div class="video-info">
    <h2>${video.title}</h2>
    <p class="video-date"><strong>Datum:</strong> ${video.date}</p>
    <p class="video-duration"><strong>Länge:</strong> ${video.duration}</p>
    <p class="video-description">${video.shortDescription}</p>
    <p class="video-tags"><strong>Tags:</strong> ${video.tags.join(", ")}</p>
  </div>
`;

      card.addEventListener("click", () => {
        renderVideo(video);
      });

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p>Videos konnten nicht geladen werden.</p>";
    console.error("Fehler beim Laden der videos.json:", error);
  }
}

function renderVideo(video) {
  viewer.innerHTML = `
    <div class="video-player-block">
      <div class="video-embed-wrap">
        <iframe
          class="video-embed"
          src="${video.embedURL}"
          title="${video.title}"
          allowfullscreen>
        </iframe>
      </div>

      <div class="video-meta">
        <h2>${video.title}</h2>
        <p><strong>Datum:</strong> ${video.date}</p>
        <p><strong>Länge:</strong> ${video.duration}</p>
        <p><strong>Kurzbeschreibung:</strong> ${video.shortDescription}</p>
        <p><strong>Langbeschreibung:</strong> ${video.longDescription}</p>
        <p><strong>Mitwirkende:</strong> ${video.contributors.join(", ")}</p>
        <p><strong>Tags:</strong> ${video.tags.join(", ")}</p>
      </div>
    </div>
  `;

  viewer.classList.remove("hidden");
  viewer.scrollIntoView({ behavior: "smooth", block: "start" });
}

loadVideos();

// Hört auf Theme-Wechsel von der Hauptseite
window.addEventListener('storage', (event) => {  
  if (event.key === 'theme') {  
    if (event.newValue === 'dark') {  
      document.documentElement.classList.add('dark-mode');  
      document.body.classList.add('dark-mode');
    } else {  
      document.documentElement.classList.remove('dark-mode');  
      document.body.classList.remove('dark-mode');
    }  
  }  
});