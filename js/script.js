/* =========================================================
   Daniel D. Agacita – Portfolio Script (vanilla JavaScript)
   1 Loader · 2 Sticky header · 3 Mobile menu · 4 Active link
   5 Typing effect · 6 Scroll reveal · 7 Skill bars
   8 Project modal · 9 Form validation · 10 Back to top
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- 1. LOADER ---------- */
  const loader = $("#loader");
  function hideLoader() {
    if (!loader || loader.classList.contains("hide")) return;
    loader.classList.add("hide");
    // Start hero reveal after the loader fades
    setTimeout(() => $$(".hero .reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 120)), 200);
  }
  window.addEventListener("load", () => setTimeout(hideLoader, 1500));
  setTimeout(hideLoader, 4000); // safety net if an asset is slow

  /* ---------- 2. STICKY HEADER ---------- */
  const header = $("#header");
  const toTop = $("#to-top");
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 500);
    updateActiveLink();
  }

  /* ---------- 3. MOBILE MENU ---------- */
  const toggle = $("#nav-toggle");
  const menu = $("#nav-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  }
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$(".nav__link", menu).forEach((l) => l.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { setMenu(false); closeModal(); }
  });

  /* ---------- 4. ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = $$("main section[id]");
  const links = $$(".nav__link");
  function updateActiveLink() {
    const pos = window.scrollY + window.innerHeight / 3;
    let current = sections[0].id;
    sections.forEach((s) => { if (pos >= s.offsetTop) current = s.id; });
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 5. TYPING EFFECT ---------- */
  const typingEl = $("#typing");
  const words = ["Web Developer", "IT Student", "Creative Designer", "Game Enthusiast"];
  let w = 0, c = 0, deleting = false;
  function type() {
    const word = words[w];
    typingEl.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; return setTimeout(type, 100); }
    if (!deleting) { deleting = true; return setTimeout(type, 1400); }
    if (c > 0) { c--; return setTimeout(type, 50); }
    deleting = false; w = (w + 1) % words.length;
    setTimeout(type, 300);
  }
  type();

  /* ---------- 6. SCROLL REVEAL ---------- */
  const revealEls = $$(".reveal:not(.hero .reveal)");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 90 + "ms"; // light stagger
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 7. ANIMATED SKILL BARS ---------- */
  function animateSkill(skill) {
    const bar = $(".skill__bar span", skill);
    const pctEl = $(".skill__pct", skill);
    const target = parseInt(bar.dataset.level, 10) || 0;
    bar.style.width = target + "%";
    let n = 0;
    const step = Math.max(1, Math.round(target / 60));
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      pctEl.textContent = n + "%";
      if (n >= target) clearInterval(timer);
    }, 24);
  }
  const skillEls = $$(".skill");
  if ("IntersectionObserver" in window) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateSkill(e.target); sio.unobserve(e.target); } });
    }, { threshold: 0.4 });
    skillEls.forEach((s) => sio.observe(s));
  } else {
    skillEls.forEach(animateSkill);
  }

  /* ---------- 8. PROJECT MODAL ----------
     "View Project" opens a details dialog. Replace each `link`
     with the real GitHub repo or live demo URL of the project. */
  const GITHUB = "https://github.com/danielagacita"; // <- change to your username
  const projects = [
    { title: "Personal Portfolio Website", img: "img/project1.svg",
      desc: "A modern, responsive dark-themed portfolio built from scratch with semantic HTML5, CSS3 (Grid, Flexbox, animations) and vanilla JavaScript. Features scroll reveal, animated skill bars, a project gallery and a validated contact form.",
      tags: ["HTML5", "CSS3", "JavaScript"], link: GITHUB + "/portfolio", label: "View on GitHub" },
    { title: "Plane vs. Asteroids: Space Survival Game", img: "img/project2.svg",
      desc: "A space survival game where the player controls a plane and dodges falling asteroids. Demonstrates object-oriented design, collision detection, scoring and increasing difficulty.",
      tags: ["Java", "Game Logic", "OOP"], link: GITHUB + "/plane-vs-asteroids", label: "View on GitHub" },
    { title: "Airplane Animation", img: "img/project3.svg",
      desc: "An animation of an airplane flying across a sky, created with Adobe Animate using motion tweens, layered parallax clouds and timed easing for a smooth cinematic feel.",
      tags: ["Adobe Animate", "Animation"], link: GITHUB, label: "View on GitHub" },
    { title: "Space Shooter Game", img: "img/project4.svg",
      desc: "An arcade-style space shooter with enemy waves, power-ups, health bars and a high-score system saved locally in the browser.",
      tags: ["JavaScript", "Canvas", "Game Dev"], link: GITHUB + "/space-shooter", label: "View on GitHub" },
    { title: "Graphic Design Projects", img: "img/project5.svg",
      desc: "A collection of posters, logos and social media graphics designed with Adobe Photoshop and Illustrator, focusing on bold colors, typography and visual storytelling.",
      tags: ["Photoshop", "Illustrator"], link: GITHUB, label: "View on GitHub" }
  ];

  const modal = $("#modal");
  let lastFocus = null;
  function openModal(index) {
    const p = projects[index];
    if (!p) return;
    lastFocus = document.activeElement;
    $("#modal-img").src = p.img;
    $("#modal-img").alt = p.title + " preview";
    $("#modal-title").textContent = p.title;
    $("#modal-desc").textContent = p.desc;
    $("#modal-tags").innerHTML = "";
    p.tags.forEach((t) => { const li = document.createElement("li"); li.textContent = t; $("#modal-tags").appendChild(li); });
    const a = $("#modal-link");
    a.href = p.link;
    a.textContent = p.label;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $(".modal__close", modal).focus();
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }
  $$("[data-project]").forEach((btn) => btn.addEventListener("click", () => openModal(Number(btn.dataset.project))));
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));

  /* ---------- 9. CONTACT FORM VALIDATION ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");
  const rules = {
    name: (v) => (v.length < 2 ? "Please enter your name (min. 2 characters)." : ""),
    email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Please enter a valid email address." : ""),
    subject: (v) => (v.length < 3 ? "Please enter a subject (min. 3 characters)." : ""),
    message: (v) => (v.length < 10 ? "Message must be at least 10 characters." : "")
  };
  function validateField(input) {
    const msg = rules[input.name](input.value.trim());
    input.classList.toggle("invalid", !!msg);
    input.classList.toggle("valid", !msg);
    input.parentElement.querySelector(".form__error").textContent = msg;
    return !msg;
  }
  $$("input, textarea", form).forEach((f) => {
    f.addEventListener("blur", () => validateField(f));
    f.addEventListener("input", () => { if (f.classList.contains("invalid")) validateField(f); });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = $$("input, textarea", form).map(validateField).every(Boolean);
    status.className = "form__status";
    if (!allValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error");
      return;
    }
    /* GitHub Pages is static, so there is no server to receive the form.
       This opens the visitor's email app with the message pre-filled.
       To send without an email app, use a service such as Formspree. */
    const data = new FormData(form);
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href =
      "mailto:daniel.agacita@example.com?subject=" + encodeURIComponent(data.get("subject")) +
      "&body=" + encodeURIComponent(body);
    status.textContent = "Thanks! Your email app should open with your message ready to send.";
    status.classList.add("success");
    form.reset();
    $$("input, textarea", form).forEach((f) => f.classList.remove("valid", "invalid"));
  });

  /* ---------- 10. BACK TO TOP + FOOTER YEAR ---------- */
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();
})();
