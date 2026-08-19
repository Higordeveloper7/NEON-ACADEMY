const STORAGE_KEY = "neonAcademyCourses";

const DEFAULT_COURSES = [
  {
    id: "agencia-local",
    title: "Curso Agência Local",
    category: "NEGÓCIOS",
    description: "Aprenda conceitos e estratégias para estruturar uma agência local.",
    features: ["Conteúdo prático", "Aulas organizadas", "Acesso online"],
    button: "QUERO CONHECER",
    link: "https://pay.kiwify.com.br/RJigGyl",
    icon: "🚀",
    image: ""
  },
  {
    id: "tdah-sem-misterios",
    title: "TDAH sem Mistérios: Guia Prático para Organizar sua Vida",
    category: "ORGANIZAÇÃO",
    description: "Um guia informativo e prático para organizar tarefas, rotina e estudos.",
    features: ["Guia prático", "Organização", "Conteúdo online"],
    button: "QUERO CONHECER",
    link: "",
    icon: "🧠",
    image: ""
  },
  {
    id: "emagrecimento-sem-misterios",
    title: "Emagrecimento sem Mistérios",
    category: "BEM-ESTAR",
    description: "Conteúdo educativo sobre hábitos, organização e informações relacionadas ao tema.",
    features: ["Conteúdo educativo", "Rotina", "Acesso online"],
    button: "QUERO CONHECER",
    link: "https://pay.kiwify.com.br/luKzlby",
    icon: "📈",
    image: ""
  }
];

function getCourses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COURSES));
  return DEFAULT_COURSES;
}

function renderCourses() {
  const grid = document.getElementById("coursesGrid");
  if (!grid) return;
  const courses = getCourses();
  grid.innerHTML = "";

  const empty = document.getElementById("emptyCourses");
  if (empty) empty.hidden = courses.length !== 0;

  courses.forEach((course, index) => {
    const card = document.createElement("article");
    card.className = "course-card";
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.innerHTML = `
      <div class="course-image ${course.image ? "has-photo" : ""}" style="${course.image ? `background-image:url('${escapeAttr(course.image)}');background-size:cover;background-position:center;` : ""}">
        ${course.image ? `<div class="course-image-overlay"></div>` : `<div class="image-icon">${escapeHtml(course.icon || "📚")}</div>`}
        <span class="course-category">${escapeHtml(course.category || "CURSO")}</span>
      </div>
      <div class="course-body">
        <h3>${escapeHtml(course.title)}</h3>
        <p>${escapeHtml(course.description || "")}</p>
        <ul>${(course.features || []).map(f => `<li>✓ ${escapeHtml(f)}</li>`).join("")}</ul>
        ${course.link ? `<a class="course-button" href="${escapeAttr(course.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(course.button || "QUERO CONHECER")} →</a>` : `<span class="course-button disabled-button">EM BREVE</span>`}
      </div>
    `;
    grid.appendChild(card);
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 80 * index);
  });

  const count = document.getElementById("courseCount");
  if (count) count.textContent = courses.length;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}
function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const nav = document.getElementById("nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", e => {
      e.stopPropagation();
      nav.classList.toggle("active");
      menuButton.textContent = nav.classList.contains("active") ? "✕" : "☰";
    });
    document.addEventListener("click", e => {
      if (!nav.contains(e.target) && !menuButton.contains(e.target)) {
        nav.classList.remove("active");
        menuButton.textContent = "☰";
      }
    });
    document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuButton.textContent = "☰";
    }));
  }

  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      document.querySelectorAll(".faq-item").forEach(i => { if (i !== item) i.classList.remove("active"); });
      item.classList.toggle("active");
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  renderCourses();
});