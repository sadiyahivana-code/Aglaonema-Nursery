console.log("JS kebaca");

// Toggle class active untuk hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");

// ketika hamburger menu di klik
hamburger.addEventListener("click", function (e) {
  e.preventDefault();
  navbarNav.classList.toggle("active");
});

// Toggle class active untuk search form
const searchForm = document.querySelector(".search-form");
const searchBtn = document.querySelector("#search-button");
const searchBox = document.querySelector("#search-box");

// ketika search button di klik
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  searchForm.classList.toggle("active");
  searchBox.focus();
});

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector(".shopping-cart");
const cartBtn = document.querySelector("#shopping-cart-button");

// ketika cart button di klik
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
// Modal Box
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailButtons = document.querySelectorAll(".item-detail-button");
const modalContents = document.querySelectorAll(".modal-content");

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    const index = btn.dataset.index;

    // Sembunyikan semua dulu
    modalContents.forEach((content) => (content.style.display = "none"));

    // Tampilkan hanya yang diklik
    document.querySelector(
      `.modal-content[data-index="${index}"]`,
    ).style.display = "flex";

    // Buka modal
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
