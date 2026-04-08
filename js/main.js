/* ============================================
   MediDesk - Main JavaScript
   ============================================ */

// Navbar scroll effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Theme toggle (light/dark)
const themeToggle = document.getElementById("themeToggle");
const mobileThemeToggle = document.getElementById("mobileThemeToggle");
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme-preference");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function resolveInitialTheme() {
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return "dark";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  const icon = isDark ? "☀️" : "🌙";
  const label = isDark ? "Light mode" : "Dark mode";
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    const iconEl = themeToggle.querySelector(".theme-toggle-icon");
    if (iconEl) iconEl.textContent = icon;
  }
  if (mobileThemeToggle) {
    mobileThemeToggle.setAttribute("aria-pressed", String(isDark));
    const iconEl = mobileThemeToggle.querySelector(".theme-toggle-icon");
    if (iconEl) iconEl.textContent = icon;
    const labelEl =
      mobileThemeToggle.querySelector(".theme-toggle-label") ||
      mobileThemeToggle.querySelector("span:not(.theme-toggle-icon)");
    if (labelEl) labelEl.textContent = label;
  }
}

function toggleTheme() {
  const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme-preference", next);
  applyTheme(next);
}

applyTheme(resolveInitialTheme());
if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", toggleTheme);

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme-preference")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

// Mobile menu
const hamburger = document.getElementById("hamburger");
const mobileDrawer = document.getElementById("mobileDrawer");
const mobileBackdrop = document.getElementById("mobileBackdrop");

function toggleMobileMenu() {
  hamburger.classList.toggle("active");
  mobileDrawer.classList.toggle("open");
  mobileBackdrop.classList.toggle("open");
}

hamburger.addEventListener("click", toggleMobileMenu);
mobileBackdrop.addEventListener("click", toggleMobileMenu);

// Close mobile menu on link click
document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", toggleMobileMenu);
});

// Chat demo
const botResponses = {
  "Hi":
    "Welcome to TeethWhite. Tap an option:\n\n▸ Book Appointment\n▸ Clinic Address\n▸ Talk to Staff",
  "Book Appointment": null,
  "Clinic Address":
    "Clinic address: We can add your clinic address here.",
  "Talk to Staff":
    "A team member will respond shortly. For urgent matters, please call us.",
};

const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");
const quickReplyButtons = document.querySelectorAll(".quick-reply-btn");

const slotOptions = [
  "Mon, Mar 9 2:30 PM",
  "Mon, Mar 9 3:00 PM",
  "Mon, Mar 9 3:30 PM",
  "Mon, Mar 9 5:30 PM",
  "Tue, Mar 10 10:00 AM",
];

const REPLY_ICON =
  '<svg class="demo-menu-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10V4h7M3 10l6-6M3 10h10a6 6 0 0 1 6 6"/></svg>';
const LIST_ICON =
  '<svg class="demo-slot-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';

function createMenuBubble() {
  const menu = document.createElement("div");
  menu.className = "demo-message bot demo-menu-bubble";
  menu.innerHTML =
    'Welcome to TeethWhite. Tap an option:<div class="demo-menu-options">' +
    '<button type="button" class="demo-menu-option" data-message="Book Appointment">' + REPLY_ICON + 'Book Appointment</button>' +
    '<button type="button" class="demo-menu-option" data-message="Clinic Address">' + REPLY_ICON + 'Clinic Address</button>' +
    '<button type="button" class="demo-menu-option" data-message="Talk to Staff">' + REPLY_ICON + 'Talk to Staff</button></div>';
  return menu;
}

function createSlotBubble() {
  const bubble = document.createElement("div");
  bubble.className = "demo-message bot demo-slot-bubble";
  bubble.innerHTML =
    'Book appointment<br>Select a preferred date/time:<div class="demo-slot-choose-row">' +
    '<button type="button" class="demo-choose-slot-btn"><span class="demo-choose-slot-icon">' + LIST_ICON + '</span>Choose slot</button></div>' +
    '<div class="demo-slot-list expanded">' +
    slotOptions.map((s) => '<button type="button" class="demo-slot-option" data-slot="' + s + '">' + REPLY_ICON + s + '</button>').join("") +
    "</div>";
  return bubble;
}

function addBotResponse(container, message) {
  if (message === "Hi") {
    container.appendChild(createMenuBubble());
  } else if (message === "Book Appointment") {
    container.appendChild(createSlotBubble());
  } else {
    const botMsg = document.createElement("div");
    botMsg.className = "demo-message bot";
    botMsg.textContent = botResponses[message];
    container.appendChild(botMsg);
  }
}

function handleMenuOptionClick() {
  const message = this.getAttribute("data-message");
  sendMessage(message);
}

function sendMessage(message) {
  quickReplyButtons.forEach((b) => (b.disabled = true));

  const userMsg = document.createElement("div");
  userMsg.className = "demo-message user";
  userMsg.textContent = message;
  chatMessages.appendChild(userMsg);

  typingIndicator.classList.add("show");
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typingIndicator.classList.remove("show");
    addBotResponse(chatMessages, message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    quickReplyButtons.forEach((b) => (b.disabled = false));

    const messages = chatMessages.querySelectorAll(".demo-message");
    if (messages.length > 10) {
      messages[0].remove();
      messages[1].remove();
    }
  }, 900);
}

quickReplyButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    sendMessage(this.getAttribute("data-message"));
  });
});

function showSlotConfirmation(slot) {
  quickReplyButtons.forEach((b) => (b.disabled = true));
  const userMsg = document.createElement("div");
  userMsg.className = "demo-message user";
  userMsg.textContent = slot;
  chatMessages.appendChild(userMsg);

  typingIndicator.classList.add("show");
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typingIndicator.classList.remove("show");
    const confirmMsg = document.createElement("div");
    confirmMsg.className = "demo-message bot";
    confirmMsg.textContent =
      "Your appointment is confirmed for " + slot + ". Reply YES if you need help.";
    chatMessages.appendChild(confirmMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    quickReplyButtons.forEach((b) => (b.disabled = false));
  }, 700);
}

chatMessages.addEventListener("click", (e) => {
  const opt = e.target.closest(".demo-menu-option");
  if (opt) handleMenuOptionClick.call(opt);

  const slotOpt = e.target.closest(".demo-slot-option");
  if (slotOpt) showSlotConfirmation(slotOpt.getAttribute("data-slot"));

});

// Counter animation
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  requestAnimationFrame(function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  });
}

// Scroll animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".animate-ready").forEach((el) => observer.observe(el));

// Counter animation trigger
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".stat-number").forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-target"));
          const suffix = stat.getAttribute("data-suffix");
          animateCounter(stat, target, suffix, 2000);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const demoSection = document.querySelector(".demo-section");
if (demoSection) statsObserver.observe(demoSection);

// Pricing toggle
const billingToggle = document.getElementById("billingToggle");
if (billingToggle) {
  billingToggle.addEventListener("click", function () {
  this.classList.toggle("active");
  const isYearly = this.classList.contains("active");

  document.querySelectorAll(".price-amount").forEach((el) => {
    el.textContent = isYearly
      ? el.getAttribute("data-yearly")
      : el.getAttribute("data-monthly");
  });
});
}

// Testimonial carousel
const carouselTrack = document.getElementById("carouselTrack");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const carouselDots = document.getElementById("carouselDots");

const totalCards = 6;
let currentSlide = 0;
let visibleCards =
  window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
let autoplayInterval;

// Create dots
function createDots() {
  carouselDots.innerHTML = "";
  const dotCount = totalCards - visibleCards + 1;
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    carouselDots.appendChild(dot);
  }
}

function updateCarousel() {
  const card = carouselTrack.querySelector(".testimonial-card");
  if (!card) return;
  const cardWidth = card.offsetWidth;
  const gap = 20;
  const offset = currentSlide * (cardWidth + gap);
  carouselTrack.style.transform = `translateX(-${offset}px)`;

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function goToSlide(index) {
  const maxSlide = Math.max(0, totalCards - visibleCards);
  currentSlide = Math.max(0, Math.min(index, maxSlide));
  updateCarousel();
}

function nextSlide() {
  const maxSlide = Math.max(0, totalCards - visibleCards);
  currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
  updateCarousel();
}

function prevSlide() {
  const maxSlide = Math.max(0, totalCards - visibleCards);
  currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
  updateCarousel();
}

if (carouselNext) carouselNext.addEventListener("click", nextSlide);
if (carouselPrev) carouselPrev.addEventListener("click", prevSlide);

// Auto-advance
function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

const carouselContainer = document.querySelector(".carousel-container");
if (carouselContainer) {
  carouselContainer.addEventListener("mouseenter", stopAutoplay);
  carouselContainer.addEventListener("mouseleave", startAutoplay);

  startAutoplay();

  // Touch support for carousel
  let touchStartX = 0;
  let touchEndX = 0;

  carouselContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carouselContainer.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  });
}

if (carouselDots) {
  createDots();
}

// Responsive update
window.addEventListener("resize", () => {
  visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  goToSlide(0);
  if (carouselDots) createDots();
});

// FAQ accordion
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.parentElement;
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));

    if (!isOpen) item.classList.add("open");
  });
});

// Trial modal
const trialModal = document.getElementById("trialModal");
const trialModalBackdrop = document.getElementById("trialModalBackdrop");
const trialModalClose = document.getElementById("trialModalClose");

if (trialModal) {
  function openTrialModal() {
    trialModal.removeAttribute("hidden");
    trialModal.classList.add("open");
    trialModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (mobileDrawer && mobileDrawer.classList.contains("open")) toggleMobileMenu();
  }

  function closeTrialModal() {
    trialModal.setAttribute("hidden", "");
    trialModal.classList.remove("open");
    trialModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const form = document.getElementById("trialForm");
    const successEl = document.getElementById("trialFormSuccess");
    const errorEl = document.getElementById("trialFormError");
    if (form) form.style.display = "";
    if (form) form.reset();
    if (successEl) successEl.style.display = "none";
    if (errorEl) errorEl.style.display = "none";
  }

  document.querySelectorAll(".open-trial-modal").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openTrialModal();
    });
  });

  if (trialModalClose) trialModalClose.addEventListener("click", closeTrialModal);
  if (trialModalBackdrop) trialModalBackdrop.addEventListener("click", closeTrialModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && trialModal.classList.contains("open")) {
      closeTrialModal();
    }
  });
}
