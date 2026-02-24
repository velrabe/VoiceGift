const BASE_PRICE = 4500;
const OPTION_PRICE = 1000;
const PROMO_CODES = {
  MAMA10: 0.1,
  PAPA10: 0.1
};

function getCurrentPrice() {
  let price = BASE_PRICE;
  const voiceParent = document.getElementById("voiceParent");
  const publishYandex = document.getElementById("publishYandex");
  const promoInput = document.getElementById("promo");

  if (voiceParent && voiceParent.checked) price += OPTION_PRICE;
  if (publishYandex && publishYandex.checked) price += OPTION_PRICE;

  let line = `Базовая стоимость: ${BASE_PRICE} ₽`;

  if (voiceParent && voiceParent.checked) {
    line += ` · голос мамы/папы +${OPTION_PRICE} ₽`;
  }
  if (publishYandex && publishYandex.checked) {
    line += ` · релиз на Яндекс Музыке +${OPTION_PRICE} ₽`;
  }

  let discountText = "";
  const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : "";
  if (promoCode && PROMO_CODES[promoCode]) {
    const discount = PROMO_CODES[promoCode];
    const discountAmount = Math.round(price * discount);
    price = price - discountAmount;
    discountText = ` · промокод ${promoCode} −${discountAmount} ₽`;
  }

  line += discountText;
  return { price, line };
}

function updatePrice() {
  const { price, line } = getCurrentPrice();
  const priceValueEl = document.getElementById("priceValue");
  const priceLineEl = document.getElementById("priceLine");

  if (priceValueEl) priceValueEl.textContent = price;
  if (priceLineEl) priceLineEl.textContent = line;
}

function scrollToOrder() {
  const el = document.getElementById("order");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToDemos() {
  const el = document.getElementById("demos");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleNav() {
  document.body.classList.toggle("nav-open");
}

function closeNav() {
  document.body.classList.remove("nav-open");
}

function handleNavClick(sectionId) {
  scrollToSection(sectionId);
  closeNav();
}

function openTelegramGroup() {
  window.open("https://t.me/your_meditations_group", "_blank");
}

function handleFakeSubmit(event) {
  event.preventDefault();
  updatePrice();
  openSuccessModal();
}

function openSuccessModal() {
  const overlay = document.getElementById("successModalOverlay");
  if (!overlay) return;
  overlay.classList.add("success-modal-overlay--visible");
  overlay.setAttribute("aria-hidden", "false");
  overlay.querySelector(".success-modal-close")?.focus();
}

function closeSuccessModal() {
  const overlay = document.getElementById("successModalOverlay");
  if (!overlay) return;
  overlay.classList.remove("success-modal-overlay--visible");
  overlay.setAttribute("aria-hidden", "true");
}

function openVideoReview(src) {
  const overlay = document.getElementById("videoModalOverlay");
  const frame = document.getElementById("videoModalFrame");
  if (!overlay || !frame) return;
  frame.src = src;
  overlay.classList.add("video-modal-overlay--visible");
}

function closeVideoReview() {
  const overlay = document.getElementById("videoModalOverlay");
  const frame = document.getElementById("videoModalFrame");
  if (!overlay || !frame) return;
  overlay.classList.remove("video-modal-overlay--visible");
  frame.src = "";
}

function initHeroStripSlider() {
  const track = document.querySelector(".hero-strip-track");
  if (!track) return;

  const cards = track.querySelectorAll(".hero-strip-card");
  if (!cards.length) return;

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotionQuery.matches) return;

  let currentIndex = 0;
  let timerId = null;

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const getSlideWidth = () => {
    const firstCard = cards[0];
    const rect = firstCard ? firstCard.getBoundingClientRect() : null;
    const section = track.closest(".hero-strip-section");
    const sectionWidth = section
      ? section.getBoundingClientRect().width
      : 0;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth || 0;

    const width = sectionWidth || viewportWidth || (rect ? rect.width : 0) || 0;

    console.log("[heroStrip] width calc", {
      rectWidth: rect ? rect.width : null,
      sectionWidth,
      viewportWidth,
      usedWidth: width,
    });

    return width;
  };

  const goToSlide = (index, withTransition) => {
    if (!isMobile()) return;
    const width = getSlideWidth();
    const offset = -index * width;
    console.log("[heroStrip] goToSlide", { index, width, offset });
    track.style.transition = withTransition
      ? "transform 0.6s ease-in-out"
      : "none";
    track.style.transform = `translateX(${offset}px)`;
  };

  const scheduleNext = () => {
    if (!isMobile()) return;
    timerId = window.setTimeout(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      goToSlide(currentIndex, true);
      scheduleNext();
    }, 3000);
  };

  const start = () => {
    if (!isMobile()) return;
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
    currentIndex = 0;
    goToSlide(currentIndex, false);
    scheduleNext();
  };

  const stop = () => {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
    track.style.transition = "";
    track.style.transform = "";
  };

  window.addEventListener("resize", () => {
    if (isMobile()) {
      start();
    } else {
      stop();
    }
  });

  if (isMobile()) {
    track.style.willChange = "transform";
    start();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updatePrice();

  const decorEls = document.querySelectorAll(
    ".section-title-decor, .price-decor-heart, .price-decor-note"
  );
  const updateDecorParallax = () => {
    if (!decorEls.length) return;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;

    decorEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = elementCenter - viewportHeight / 2;

      const factorAttr = parseFloat(el.dataset.parallax);
      const isPriceDecor =
        el.classList.contains("price-decor-heart") ||
        el.classList.contains("price-decor-note");
      const defaultIntensity = isPriceDecor ? 0.03 : 0.06;
      const intensity = !Number.isNaN(factorAttr)
        ? factorAttr
        : defaultIntensity;
      const offset = -distanceFromCenter * intensity;

      el.style.setProperty("--decor-parallax", `${offset}px`);
    });
  };

  updateDecorParallax();
  window.addEventListener("scroll", updateDecorParallax, { passive: true });
  window.addEventListener("resize", updateDecorParallax);

  const navOverlay = document.querySelector(".site-nav-overlay");
  if (navOverlay) {
    navOverlay.addEventListener("click", (event) => {
      if (event.target === navOverlay) {
        closeNav();
      }
    });
  }

  const videoOverlay = document.getElementById("videoModalOverlay");
  if (videoOverlay) {
    videoOverlay.addEventListener("click", (event) => {
      if (event.target === videoOverlay) {
        closeVideoReview();
      }
    });
  }

  const successOverlay = document.getElementById("successModalOverlay");
  if (successOverlay) {
    successOverlay.addEventListener("click", (event) => {
      if (event.target === successOverlay) {
        closeSuccessModal();
      }
    });
  }

  initHeroStripSlider();
});

