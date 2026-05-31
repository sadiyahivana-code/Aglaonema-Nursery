console.log("JS kebaca");

// Toggle class active untuk hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");

hamburger.addEventListener("click", function (e) {
  e.preventDefault();
  navbarNav.classList.toggle("active");
});

// Toggle class active untuk search form
const searchForm = document.querySelector(".search-form");
const searchBtn = document.querySelector("#search-button");
const searchBox = document.querySelector("#search-box");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  searchForm.classList.toggle("active");
  searchBox.focus();
  shoppingCart.classList.remove("active");
});

// Cegah search form tertutup saat klik di dalamnya
searchForm.addEventListener("click", function (e) {
  e.stopPropagation();
});

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector(".shopping-cart");
const cartBtn = document.querySelector("#shopping-cart-button");

cartBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  shoppingCart.classList.toggle("active");
  searchForm.classList.remove("active");
});

// klik di luar elemen
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }

  if (!cartBtn.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

// Modal Box
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailButtons = document.querySelectorAll(".item-detail-button");
const modalContents = document.querySelectorAll(".modal-content");

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    const index = btn.dataset.index;
    modalContents.forEach((content) => (content.style.display = "none"));
    document.querySelector(
      `.modal-content[data-index="${index}"]`,
    ).style.display = "flex";
    itemDetailModal.classList.add("active");
  };
});

document.querySelector(".modal .close-icon").onclick = (e) => {
  e.preventDefault();
  itemDetailModal.classList.remove("active");
};

window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.classList.remove("active");
  }
};

// Search functionality
searchBox.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");
  const menuCards = document.querySelectorAll(".menu-card");

  productCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(keyword) ? "block" : "none";
  });

  menuCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(keyword) ? "block" : "none";
  });
});

// Search functionality
searchBox.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");
  const menuCards = document.querySelectorAll(".menu-card");

  productCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(keyword) ? "block" : "none";
  });

  menuCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(keyword) ? "block" : "none";
  });

  // Auto scroll ke products kalau ada keyword
  if (keyword.length > 0) {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  }
});

// Tekan Enter di search box
searchBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
    searchForm.classList.remove("active");
  }
});
