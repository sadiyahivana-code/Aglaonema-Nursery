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

// Klik di luar elemen
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

  if (keyword.length > 0) {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  }
});

searchBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
    searchForm.classList.remove("active");
  }
});

// =============================================
// CHECKOUT — simpan pesanan ke localStorage
// =============================================
function submitCheckout() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !phone) {
    alert("Lengkapi semua data dulu ya!");
    return;
  }

  const cart = Alpine.store("cart");

  if (cart.items.length === 0) {
    alert("Keranjang kamu kosong!");
    return;
  }

  // Buat objek pesanan
  const order = {
    id: Date.now(),
    date: new Date().toLocaleString("id-ID"),
    customer: { name, email, phone },
    items: cart.items.map((i) => ({
      id: i.id,
      name: i.name,
      img: i.img,
      price: i.price,
      qty: i.qty,
      total: i.total,
    })),
    total: cart.total,
  };

  // Simpan ke localStorage
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Reset cart
  cart.items.splice(0, cart.items.length);
  cart.updateCart();
  cart.save();

  // Reset form
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";

  // Tutup cart panel
  shoppingCart.classList.remove("active");

  alert("Pesanan berhasil dikirim! Terima kasih " + name + " 🌿");
}

// Add to cart dari modal
document.querySelectorAll(".modal-content").forEach((content) => {
  const addBtn = content.querySelector("a[href='#']");
  if (!addBtn) return;

  addBtn.addEventListener("click", function (e) {
    e.preventDefault(); // ← cegah scroll ke home
    e.stopPropagation();

    const index = parseInt(content.dataset.index);
    const productsData = Alpine.store ? null : null;
    const items = Alpine.$data?.[0]?.items; // fallback

    // Ambil data dari Alpine Products
    const allProducts = document.querySelector("[x-data='Products']")
      ?._x_dataStack?.[0]?.items;
    if (!allProducts) return;

    Alpine.store("cart").add(allProducts[index]);
    itemDetailModal.classList.remove("active"); // tutup modal setelah add
  });
});
