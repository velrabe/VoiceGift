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

function openTelegramGroup() {
  window.open("https://t.me/your_meditations_group", "_blank");
}

function handleFakeSubmit(event) {
  event.preventDefault();
  updatePrice();
  alert("Здесь будет переход к оплате или отправка формы. Сейчас это демо.");
}

document.addEventListener("DOMContentLoaded", updatePrice);

