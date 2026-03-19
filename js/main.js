/* ============================================
   ClinicBot - Main JavaScript
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
  "Appointment chahiye":
    "Aaj ke available slots:\n\n1️⃣ 10:30 AM\n2️⃣ 1:00 PM\n3️⃣ 4:30 PM\n4️⃣ 5:00 PM\n\nKonsa time book karein?",
  "Kal ka slot?":
    "Kal ke available slots:\n\n🕙 10:00 AM ✓\n🕙 10:30 AM ✓\n🕚 11:30 AM ✓\n🕒 3:00 PM ✓\n\nSlot number reply karein.",
  "Cancel karna hai":
    "Appointment cancel karne ke liye apna Appointment ID share karein.\n(e.g. #1042)\n\nYa 'list' type karein upcoming appointments dekhne ke liye.",
  "Kab available hain?":
    "Aaj ke available slots:\n\n✅ 11:00 AM\n✅ 2:30 PM\n✅ 5:00 PM\n✅ 6:00 PM\n\nKonsa time theek rahega? 😊",
};

const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");
const quickReplyButtons = document.querySelectorAll(".quick-reply-btn");

quickReplyButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    const message = this.getAttribute("data-message");

    // Disable all buttons
    quickReplyButtons.forEach((b) => (b.disabled = true));

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "demo-message user";
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);

    // Show typing indicator
    typingIndicator.classList.add("show");
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // After delay, show bot response
    setTimeout(() => {
      typingIndicator.classList.remove("show");

      const botMsg = document.createElement("div");
      botMsg.className = "demo-message bot";
      botMsg.textContent = botResponses[message];
      chatMessages.appendChild(botMsg);

      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Re-enable buttons
      quickReplyButtons.forEach((b) => (b.disabled = false));

      // Keep max 8 messages
      const messages = chatMessages.querySelectorAll(".demo-message");
      if (messages.length > 8) {
        messages[0].remove();
        messages[1].remove();
      }
    }, 900);
  });
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
