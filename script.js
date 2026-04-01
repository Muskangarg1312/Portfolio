window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 800); // delay for smooth feel
});

// ================= GLOBAL MOUSE =================
let mouse = { x: 0, y: 0 };
let disableParticles = false;
let nodeBgColor;
let textColor;
let lineColor;

function updateSkillTheme() {
  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    nodeBgColor = "rgba(18,18,35,0.92)";
    textColor = "#ffffff";
    lineColor = [255, 255, 255];
  } else {
    nodeBgColor = "rgba(255,255,255,0.95)";
    textColor = "#171717";
    lineColor = [0, 0, 0];
  }
}

updateSkillTheme();

// ================= THEME TOGGLE =================
const toggleBtn = document.getElementById("themeToggle");

// 🔹 Load saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (toggleBtn) toggleBtn.textContent = "🌙";
  } else {
    if (toggleBtn) toggleBtn.textContent = "☀️";
  }

  updateSkillTheme();
});

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "🌙";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "☀️";
    }

    updateSkillTheme(); // 🔥 update particle theme
  });
}
// ================= RAINBOW BACKGROUND =================
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

resizeBgCanvas();
window.addEventListener("resize", resizeBgCanvas);

let particles = [];
let hue = 0;

// SINGLE mouse listener (important)
document.addEventListener("mousemove", (e) => {
  const skillsSection = document.getElementById("skills");

  if (skillsSection) {
    const rect = skillsSection.getBoundingClientRect();

    const insideSkills =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (insideSkills) {
      disableParticles = true;

      // 🔥 instantly remove all existing particles
      particles = [];

      return;
    } else {
      disableParticles = false;
    }
  }

  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 30 + 10;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.life = 100;
    this.color = `hsl(${hue}, 100%, 60%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 2;
  }

  draw() {
    bgCtx.globalAlpha = this.life / 100;
    bgCtx.fillStyle = this.color;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    bgCtx.fill();
    bgCtx.globalAlpha = 1;
  }
}

function animateBackground() {
  bgCtx.fillStyle = document.body.classList.contains("dark")
    ? "rgba(10,10,25,0.15)"
    : "rgba(247,248,252,0.08)";

  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  hue += 2;

  if (!disableParticles) {
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle());
    }
  }

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();

    if (particle.life <= 0) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animateBackground);
}

animateBackground();

// =======   SCROLL BUTTTONS ============

const topBtn = document.getElementById("scrollTopBtn");
const bottomBtn = document.getElementById("scrollBottomBtn");

// SHOW/HIDE BUTTONS
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollY > 300) {
    topBtn.classList.add("show");
  } else {
    topBtn.classList.remove("show");
  }

  if (scrollY < height - 300) {
    bottomBtn.classList.add("show");
  } else {
    bottomBtn.classList.remove("show");
  }
});

// SCROLL TOP
topBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// SCROLL BOTTOM
bottomBtn.onclick = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
};

// ================= PREMIUM SKILLS NETWORK =================
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("network");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const groupCenters = {
    frontend: { x: canvas.width * 0.25, y: canvas.height * 0.4 },
    backend: { x: canvas.width * 0.75, y: canvas.height * 0.4 },
    cms: { x: canvas.width * 0.5, y: canvas.height * 0.75 },
  };

  function resizeCanvas1() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    groupCenters.frontend.x = canvas.width * 0.25;
    groupCenters.backend.x = canvas.width * 0.75;
    groupCenters.cms.x = canvas.width * 0.5;

    groupCenters.frontend.y = canvas.height * 0.4;
    groupCenters.backend.y = canvas.height * 0.4;
    groupCenters.cms.y = canvas.height * 0.75;

    if (window.innerWidth < 768) {
      groupCenters.frontend.x = canvas.width / 2;
      groupCenters.backend.x = canvas.width / 2;
      groupCenters.cms.x = canvas.width / 2;

      groupCenters.frontend.y = canvas.height * 0.25;
      groupCenters.backend.y = canvas.height * 0.5;
      groupCenters.cms.y = canvas.height * 0.75;
    }
  }

  resizeCanvas1();
  window.addEventListener("resize", resizeCanvas1);

  let skillMouse = { x: null, y: null };
  let magneticRadius = 180;
  let nodeScale = 1;

  canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    skillMouse.x = e.clientX - rect.left;
    skillMouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", function () {
    skillMouse.x = null;
    skillMouse.y = null;
  });

  // 🔥 BASE ICON URL
  const baseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/";

  const skills = [
    {
      text: "HTML",
      color: "#e34f26",
      icon: "html5/html5-original.svg",
      group: "frontend",
    },
    {
      text: "CSS",
      color: "#1572b6",
      icon: "css3/css3-original.svg",
      group: "frontend",
    },
    {
      text: "JavaScript",
      color: "#f7df1e",
      icon: "javascript/javascript-original.svg",
      group: "frontend",
    },
    {
      text: "PHP",
      color: "#777bb4",
      icon: "php/php-original.svg",
      group: "backend",
    },
    {
      text: "Laravel",
      color: "#ff2d20",
      icon: "laravel/laravel-original.svg",
      group: "backend",
    },
    {
      text: "CodeIgniter",
      color: "#dd4814",
      icon: "codeigniter/codeigniter-plain.svg",
      group: "backend",
    },
    {
      text: "jQuery",
      color: "#0769ad",
      icon: "jquery/jquery-original.svg",
      group: "frontend",
    },
  ];

  // Manual URLs for non-devicon icons
  const extraIcons = {
    Canva:
      "https://cdn.iconscout.com/icon/free/png-256/free-canva-icon-svg-download-png-3175197.png?f=webp",
    "MS Office": "https://cdn-icons-png.flaticon.com/512/732/732221.png",
    Shopify:
      "https://cdn.iconscout.com/icon/free/png-256/free-shopify-logo-icon-svg-download-png-2945149.png?f=webp",
    AJAX: "https://icons.veryicon.com/png/o/miscellaneous/basic-monochrome-icon/refresh-149.png",
    WordPress: "https://cdn-icons-png.flaticon.com/512/174/174881.png",
  };

  skills.push(
    {
      text: "Canva",
      color: "#00c4cc",
      icon: extraIcons["Canva"],
      group: "cms",
    },
    {
      text: "MS Office",
      color: "#fbbe07",
      icon: extraIcons["MS Office"],
      group: "cms",
    },
    {
      text: "Shopify",
      color: "#95bf47",
      icon: extraIcons["Shopify"],
      group: "cms",
    },
    {
      text: "AJAX",
      color: "#467cfd",
      icon: extraIcons["AJAX"],
      group: "frontend",
    },
    {
      text: "WordPress",
      color: "#21759b",
      icon: extraIcons["WordPress"],
      group: "cms",
    },
  );

  class Node {
    constructor(skill) {
      this.text = skill.text;
      this.color = skill.color;
      this.group = skill.group;

      this.iconSrc = skill.icon.startsWith("http")
        ? skill.icon
        : baseURL + skill.icon;

      this.baseX = Math.random() * canvas.width;
      this.baseY = Math.random() * canvas.height;
      this.x = this.baseX;
      this.y = this.baseY;

      this.radius = Math.min(canvas.width, canvas.height) * 0.06;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.002 + Math.random() * 0.003;

      this.icon = new Image();
      this.iconLoaded = false;
      this.iconError = false;

      this.icon.onload = () => {
        this.iconLoaded = true;
      };

      this.icon.onerror = () => {
        this.iconError = true;
        console.warn("Failed to load icon:", this.iconSrc);
      };

      this.icon.src = this.iconSrc;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(nodeScale, nodeScale);
      ctx.translate(-this.x, -this.y);
      // Dark bubble
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeBgColor;
      ctx.fill();

      // Glow border
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.closePath();

      ctx.shadowBlur = 0;

      // Draw icon ONLY if loaded and not broken
      if (this.iconLoaded && !this.iconError) {
        ctx.save();

        // 🔹 Clip inside circle (prevents overflow)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.clip();

        // 🔹 Responsive sizing based on circle radius
        const padding = this.radius * 0.75; // space inside circle
        const iconSize = this.radius * 1.65 - padding;

        ctx.drawImage(
          this.icon,
          this.x - iconSize / 2,
          this.y - iconSize / 2,
          iconSize,
          iconSize,
        );

        ctx.restore();
      } else {
        // 🔹 fallback small colored dot if icon fails
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      // 🔹 Responsive text
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";

      // Font size based on circle radius
      const fontSize = this.radius * 0.35;
      ctx.font = `${fontSize}px Poppins`;

      // Position text just below circle
      const textY = this.y + this.radius + this.radius * 0.5;

      ctx.fillText(this.text, this.x, textY);
      ctx.restore();
    }

    update() {
      const center = groupCenters[this.group];
      if (!center) return;

      // Each group gets a movement radius
      const groupRadius = Math.min(canvas.width, canvas.height) * 0.18;

      // Move in circular floating motion
      this.angle += this.speed;

      this.x = center.x + Math.cos(this.angle + this.baseX) * groupRadius;
      this.y = center.y + Math.sin(this.angle + this.baseY) * groupRadius;

      // Mouse repulsion
      if (skillMouse.x !== null && skillMouse.y !== null) {
        const dx = skillMouse.x - this.x;
        const dy = skillMouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < magneticRadius) {
          const force = (magneticRadius - distance) / magneticRadius;

          this.x -= dx * force * 0.05;
          this.y -= dy * force * 0.05;

          nodeScale = 1 + force * 0.35;
        } else {
          nodeScale = 1;
        }
      }

      this.draw();
    }
  }

  const nodes = skills.map((skill) => new Node(skill));

  function drawBackgroundText() {
    // 🚫 Hide headings completely on mobile
    if (window.innerWidth < 768) return;

    ctx.save();

    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3;
    ctx.font = "bold 120px Poppins";
    ctx.textAlign = "center";

    ctx.strokeText("FRONTEND", canvas.width * 0.25, canvas.height / 2);
    ctx.strokeText("BACKEND", canvas.width * 0.75, canvas.height / 2);
    ctx.strokeText("CMS", canvas.width * 0.5, canvas.height * 0.85);

    ctx.restore();
  }

  function connectNodes() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = Math.min(canvas.width, canvas.height) * 0.25;
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${1 - distance / maxDistance})`;
          ctx.lineWidth = 1.2 + (1 - distance / maxDistance) * 2;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateSkills() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackgroundText(); // 👈 add here
    connectNodes();
    nodes.forEach((node) => node.update());

    requestAnimationFrame(animateSkills);
  }

  animateSkills();
});

function initRangeSliders() {
  const sliders = document.querySelectorAll('input[type="range"]');

  sliders.forEach((slider) => {
    const update = () => {
      const value =
        ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

      slider.style.background = `
        linear-gradient(
          to right,
          #6c63ff, 
          #ff4ecd,
          #e0e0e0 ${value}%,
          #e0e0e0 100%
        )
      `;
    };

    slider.addEventListener("input", update);
    update(); // initial fill
  });
}

const projects = document.querySelectorAll(".project");
const images = document.querySelectorAll(".images");
const indicator = document.querySelector(".timeline-indicator");
const section = document.querySelector(".projects");
const cursor = document.querySelector(".cursor");

const total = projects.length;

function updateProject(index) {
  projects.forEach((p) => p.classList.remove("active"));
  images.forEach((i) => i.classList.remove("active"));

  projects[index].classList.add("active");
  images[index].classList.add("active");

  const timeline = document.querySelector(".timeline");
  const timelineHeight = timeline.offsetHeight - 60;
  const step = timelineHeight / (total - 1);

  indicator.style.top = step * index + "px";
}

window.addEventListener("scroll", () => {
  const rect = section.getBoundingClientRect();
  const sectionHeight = section.scrollHeight - window.innerHeight;

  // ✅ ONLY RUN INSIDE PROJECT SECTION
  if (rect.top <= 0 && rect.bottom > window.innerHeight) {
    let progress = Math.abs(rect.top) / sectionHeight;
    let index = Math.floor(progress * total);

    if (index >= total) index = total - 1;

    updateProject(index);
  } else {
    // ✅ STOP PROJECT CONTROL OUTSIDE
    return;
  }
});

const progress = document.querySelector(".timeline-progress");

function updateProject(index) {
  projects.forEach((p) => p.classList.remove("active"));
  images.forEach((i) => i.classList.remove("active"));

  projects[index].classList.add("active");
  images[index].classList.add("active");

  /* MOVE INDICATOR */

  const move = index * 180;

  indicator.style.top = move + "px";

  /* PROGRESS BAR */

  progress.style.height = move + 60 + "px";
}

/* CURSOR */
// const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

const projectArea = document.querySelector(".projects-right");

projectArea.addEventListener("mouseenter", () => {
  cursor.style.opacity = 1;
  cursor.style.transform = "translate(-50%,-50%) scale(1)";
});

projectArea.addEventListener("mouseleave", () => {
  cursor.style.opacity = 0;
  cursor.style.transform = "translate(-50%,-50%) scale(.6)";
});

// ONLY run on mobile
if (window.innerWidth <= 768) {
  const swipers = document.querySelectorAll(".mySwiper");

  swipers.forEach((swiperEl) => {
    new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 10,

      loop: true,

      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },

      pagination: {
        el: swiperEl.querySelector(".swiper-pagination"),
        clickable: true,
      },

      grabCursor: true,
    });
  });
}

/* CLOCK MARKS */

const marks = document.querySelector(".marks");

for (let i = 0; i < 60; i++) {
  const mark = document.createElement("span");

  mark.style.height = i % 5 == 0 ? "10%" : "5%";
  mark.style.transform = `rotate(${i * 6}deg)`;
  mark.style.width = i % 5 === 0 ? "3px" : "1px";

  marks.appendChild(mark);
}

// DIGITAL CLOCK

function updateDigitalClock() {
  const now = new Date();

  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();

  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  h = String(h).padStart(2, "0");
  m = String(m).padStart(2, "0");
  s = String(s).padStart(2, "0");

  document.getElementById("digitalClock").innerText = `${h}:${m}:${s} ${ampm}`;
}

setInterval(updateDigitalClock, 1000);

updateDigitalClock();

/* CLOCK MOVEMENT */

function updateClock() {
  const now = new Date();

  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours();

  document.querySelector(".second").style.transform =
    `translateX(-50%) rotate(${s * 6}deg)`;

  document.querySelector(".minute").style.transform =
    `translateX(-50%) rotate(${m * 6}deg)`;

  document.querySelector(".hour").style.transform =
    `translateX(-50%) rotate(${h * 30 + m * 0.5}deg)`;

  /* DAY + DATE */

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[now.getDay()];

  const date = now.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  document.getElementById("day").textContent = day;
  document.getElementById("date").textContent = date;

  // status (morning/evening)
  let status = "";
  if (h < 12) status = "🌅 Good Morning";
  else if (h < 18) status = "☀️ Good Afternoon";
  else status = "🌙 Good Evening";

  document.getElementById("timeStatus").innerText = status;
}

setInterval(updateClock, 1000);
updateClock();

function getLocation() {
  if (!navigator.geolocation) {
    document.getElementById("location").textContent = "Location not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    );

    const data = await res.json();

    document.getElementById("location").textContent =
      `${data.city || data.locality}, ${data.countryName}`;
  });
}

getLocation();

/* SPOTIFY SONG FETCHING */

const playlists = {
  lofi: "https://open.spotify.com/embed/playlist/37i9dQZF1DWYoYGBbGKurt",

  bollywood: "https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmNBRM",

  pop: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",

  chill: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6",

  workout: "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP",
};

function play(type) {
  document.getElementById("player").src = playlists[type];
}

const allPlaylists = Object.values(playlists);

function discover() {
  let random = Math.floor(Math.random() * allPlaylists.length);

  document.getElementById("player").src = allPlaylists[random];
}

function moreMusic() {
  window.open("https://open.spotify.com/genre/0JQ5DAqbMKFEC4WFtoNRpw");
}

// CANVAS DRAW

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");

const eraser = document.getElementById("eraser");
const clearBtn = document.getElementById("clearCanvas");
const saveBtn = document.getElementById("saveCanvas");

let drawing = false;
let eraseMode = false;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;

  ctx.scale(ratio, ratio);
  initRangeSliders();
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

canvas.addEventListener("mousedown", () => (drawing = true));

canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});

canvas.addEventListener("mouseleave", () => (drawing = false));

canvas.addEventListener("mousemove", draw);

let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);
canvas.addEventListener("mousemove", draw);

function startDraw(e) {
  drawing = true;

  const rect = canvas.getBoundingClientRect();

  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
}

function stopDraw() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.imageSmoothingEnabled = true;
  if (eraseMode) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = colorPicker.value;
  }

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
}

// ===== TOUCH SUPPORT (MOBILE FIX) =====

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];

  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;

  drawing = true;
});

canvas.addEventListener("touchmove", (e) => {
  if (!drawing) return;

  e.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];

  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (eraseMode) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = colorPicker.value;
  }

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
});

canvas.addEventListener("touchend", () => {
  drawing = false;
  ctx.beginPath();
});

/* ERASER */

eraser.onclick = () => {
  eraseMode = !eraseMode;

  if (eraseMode) {
    canvas.style.cursor = 'url("eraser.png") 8 24, auto';

    eraser.style.background = "#ff3c3c";
  } else {
    canvas.style.cursor = 'url("./pencil.png") 4 24, auto';

    eraser.style.background = "rgba(255,255,255,0.15)";
  }
};

/* CLEAR */

clearBtn.onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/* SAVE */

saveBtn.onclick = () => {
  const link = document.createElement("a");

  link.download = "drawing.png";
  link.href = canvas.toDataURL();

  link.click();
};

// QUOTE GENERATOR

fetch("https://dummyjson.com/quotes/random")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("quoteText").innerText = `"${data.quote}"`;
    document.getElementById("quoteText").onclick = function () {
      this.classList.toggle("expand");
    };

    document.getElementById("quoteAuthor").innerText = data.author;
  })
  .catch(() => {
    document.getElementById("quoteText").innerText =
      "Design is intelligence made visible.";

    document.getElementById("quoteAuthor").innerText = "Alina Wheeler";
  });

// CREATIVE TOOLKIT

function openTool(type) {
  document.getElementById("popup").style.display = "flex";

  if (type === "palette") showPalette();
  if (type === "gradient") showGradient();
  if (type === "shadow") showShadow();
  if (type === "glass") showGlass();
}

function closeTool() {
  document.getElementById("popup").style.display = "none";
}

/* COPY */
function copy(btn, text) {
  navigator.clipboard.writeText(text);
  btn.innerText = "Copied ✓";
  btn.classList.add("copied");

  setTimeout(() => {
    btn.innerText = "Copy CSS";
    btn.classList.remove("copied");
  }, 1500);
}

/* PALETTE */
function showPalette() {
  const c = document.getElementById("toolContent");

  c.innerHTML = `
<h3>Color Palette</h3>
<button class="copy-btn" onclick="generatePalette()">Generate</button>
<div class="palette" id="palette"></div>
`;

  generatePalette();
}

function generatePalette() {
  const box = document.getElementById("palette");
  box.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const color = `hsl(${Math.random() * 360},70%,60%)`;

    const div = document.createElement("div");
    div.className = "color";
    div.style.background = color;
    div.innerText = color;

    div.onclick = () => {
      navigator.clipboard.writeText(color);
      div.innerText = "Copied!";
      setTimeout(() => (div.innerText = color), 1000);
    };

    box.appendChild(div);
  }
}

let gradCSS = "";
let color1 = "";
let color2 = "";

function showGradient() {
  const c = document.getElementById("toolContent");

  c.innerHTML = `
<h3>Gradient Generator</h3>
  
<label>Angle</label>
<input type="range" id="angle" min="0" max="360" value="135">
  
<button class="copy-btn" id="randomBtn">Random Colors</button>
  
<div class="gradient-preview" id="gradPreview"></div>
  
<div class="code" id="gradCode"></div>
  
<button class="copy-btn" id="copyGrad">Copy CSS</button>
`;
  initRangeSliders();

  document.getElementById("copyGrad").onclick = function () {
    copy(this, gradCSS);
  };

  // 🔥 only update angle (no new colors)
  document.getElementById("angle").oninput = updateGradient;

  // 🔥 generate new colors only on button click
  document.getElementById("randomBtn").onclick = generateColors;

  generateColors(); // initial
}

function generateColors() {
  color1 = `hsl(${Math.random() * 360},80%,60%)`;
  color2 = `hsl(${Math.random() * 360},80%,60%)`;

  updateGradient();
}

function updateGradient() {
  const angle = document.getElementById("angle").value;

  gradCSS = `background: linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%);`;

  document.getElementById("gradPreview").style.background =
    `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  document.getElementById("gradCode").innerText = gradCSS;
}

/* SHADOW */
let shadowCSS = "";
let currentColor = "";

function showShadow() {
  const c = document.getElementById("toolContent");

  c.innerHTML = `
<h3>Shadow Generator</h3>

<div class="shadow-grid">

  <div>
    <label>X Offset</label>
    <input type="range" id="x" min="-50" max="50" value="0">
  </div>

  <div>
    <label>Y Offset</label>
    <input type="range" id="y" min="-50" max="50" value="10">
  </div>

  <div>
    <label>Blur</label>
    <input type="range" id="blur" min="0" max="80" value="20">
  </div>

  <div>
    <label>Spread</label>
    <input type="range" id="spread" min="-20" max="40" value="5">
  </div>

  <div>
    <label>Opacity</label>
    <input type="range" id="opacity" min="0" max="100" value="40">
  </div>

  <div class="color-field">
    <label>Color</label>
    <div class="color-box">
      <input type="color" id="colorPickerr" value="#6c63ff">
    </div>
  </div>

</div>

<!-- 👇 GRID KE BAHAR -->
<div class="shadow-preview" id="shadowPreview"></div>

<div class="code" id="shadowCode"></div>

<button class="copy-btn" id="copyShadow">Copy CSS</button>
`;

  // 👇 individually bind (important fix)
  document.getElementById("x").oninput = updateShadow;
  document.getElementById("y").oninput = updateShadow;
  document.getElementById("blur").oninput = updateShadow;
  document.getElementById("spread").oninput = updateShadow;
  document.getElementById("opacity").oninput = updateShadow;
  document.getElementById("colorPickerr").oninput = updateShadow;

  document.getElementById("copyShadow").onclick = function () {
    copy(this, shadowCSS);
  };
  initRangeSliders();
  updateShadow();
}

/* UPDATE */
function updateShadow() {
  const x = +document.getElementById("x").value;
  const y = +document.getElementById("y").value;
  const blur = +document.getElementById("blur").value;
  const spread = +document.getElementById("spread").value;
  const opacity = +document.getElementById("opacity").value;

  const hex = document.getElementById("colorPickerr").value;

  // HEX → RGB
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  const color = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;

  shadowCSS = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};`;

  const preview = document.getElementById("shadowPreview");

  preview.style.boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;

  document.getElementById("shadowCode").innerText = shadowCSS;
}

/* GLASS ADVANCED */
let glassCSS = "";

function showGlass() {
  const c = document.getElementById("toolContent");

  c.innerHTML = `
<h3>Advanced Glass UI</h3>

<div class="glass-grid">

<div>
<label>Blur</label>
<input type="range" id="blur" min="0" max="40" value="15">
</div>

<div>
<label>Transparency</label>
<input type="range" id="opacity" min="0" max="100" value="20">
</div>

<div>
<label>Border Strength</label>
<input type="range" id="border" min="0" max="100" value="30">
</div>

<div>
<label>Shadow</label>
<input type="range" id="shadow" min="0" max="50" value="20">
</div>

<div>
<label>Saturation</label>
<input type="range" id="saturation" min="50" max="200" value="120">
</div>

<div class="color-field">
<label>Color</label>
  <div class="color-box">
    <input type="color" id="tint" value="#6c63ff">
  </div>
</div>

</div>

<div class="glass-preview" id="glassPreview">
  <span>Glass UI</span>
</div>

<div class="code" id="glassCode"></div>

<button class="copy-btn" id="copyGlass">Copy CSS</button>
`;

  document.querySelectorAll("input").forEach((el) => {
    el.oninput = updateGlass;
  });

  document.getElementById("copyGlass").onclick = function () {
    copy(this, glassCSS);
  };

  initRangeSliders();
  updateGlass();
}

function updateGlass() {
  const blur = document.getElementById("blur").value;
  const opacity = document.getElementById("opacity").value;
  const border = document.getElementById("border").value;
  const shadow = document.getElementById("shadow").value;
  const saturation = document.getElementById("saturation").value;
  const tint = document.getElementById("tint").value;

  // HEX → RGB
  const r = parseInt(tint.substr(1, 2), 16);
  const g = parseInt(tint.substr(3, 2), 16);
  const b = parseInt(tint.substr(5, 2), 16);

  const bg = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;

  glassCSS = `
background: ${bg};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid rgba(255,255,255,${border / 100});
box-shadow: 0 8px ${shadow * 2}px rgba(0,0,0,0.3);
border-radius: 16px;
`;

  const preview = document.getElementById("glassPreview");

  preview.style.background = bg;
  preview.style.backdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
  preview.style.webkitBackdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
  preview.style.border = `1px solid rgba(255,255,255,${border / 100})`;
  preview.style.boxShadow = `0 8px ${shadow * 2}px rgba(0,0,0,0.3)`;

  document.getElementById("glassCode").innerText = glassCSS;
}

// SELECT

gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray(".exp-card");
const track = document.querySelector(".exp-track");

const getScrollAmount = () => track.scrollWidth - window.innerWidth;

// ✅ MAIN SCROLL (SMOOTH + SNAP)
gsap.to(track, {
  x: () => -getScrollAmount(),
  ease: "none",
  scrollTrigger: {
    trigger: "#exp-scroll",
    start: "top top",
    end: () => "+=" + getScrollAmount(),
    scrub: 0.6, // 👈 smoother (was 1 → causing lag)
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,

    // 🔥 THIS FIXES YOUR MAIN ISSUE
    snap: {
      snapTo: 1 / (cards.length - 1), // 👈 1 scroll = 1 card
      duration: 0.4,
      ease: "power2.out",
    },
  },
});

// ✅ ACTIVE CARD (FIXED LOGIC)
ScrollTrigger.create({
  trigger: "#exp-scroll",
  start: "top top",
  end: () => "+=" + getScrollAmount(),
  scrub: true,
  onUpdate: (self) => {
    // 🔥 use progress instead of getBoundingClientRect (NO GLITCH)
    let index = Math.round(self.progress * (cards.length - 1));

    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  },
});

// CONTACT FORM

const sendBtn = document.getElementById("sendBtn");

sendBtn.onclick = async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    showToast("⚠️ Fill all fields");
    return;
  }

  try {
    await addDoc(collection(db, "contacts"), {
      name,
      email,
      message,
      time: new Date(),
    });

    showToast("✅ Message sent");

    // clear form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
  } catch (e) {
    showToast("❌ Failed to send");
  }
};
