console.log("JS kebaca");

// Toggle hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");
hamburger.addEventListener("click", function (e) {
  e.preventDefault();
  navbarNav.classList.toggle("active");
});

// Toggle search form
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

// Toggle shopping cart
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
let currentModalProduct = null;

document.querySelector(".products").addEventListener("click", function (e) {
  const btn = e.target.closest(".item-detail-button");
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();

  const index = parseInt(btn.dataset.index);
  const allProducts = document.querySelector("[x-data='Products']")
    ?._x_dataStack?.[0]?.items;
  if (!allProducts || !allProducts[index]) return;

  const p = allProducts[index];
  currentModalProduct = p;

  document.getElementById("modal-img").src = p.img;
  document.getElementById("modal-img").alt = p.name;
  document.getElementById("modal-name").textContent = p.name;
  document.getElementById("modal-desc").textContent = p.desc || "";
  document.getElementById("modal-price").textContent =
    "Rp " + p.price.toLocaleString("id-ID");

  const oldPriceEl = document.getElementById("modal-old-price");
  if (p.oldPrice > 0) {
    oldPriceEl.textContent = "Rp " + p.oldPrice.toLocaleString("id-ID");
    oldPriceEl.style.display = "inline";
  } else {
    oldPriceEl.style.display = "none";
  }

  feather.replace();
  itemDetailModal.classList.add("active");
});

document
  .getElementById("modal-add-cart")
  .addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!currentModalProduct) return;
    Alpine.store("cart").add(currentModalProduct);
    itemDetailModal.classList.remove("active");
  });

document.querySelector(".modal .close-icon").onclick = (e) => {
  e.preventDefault();
  itemDetailModal.classList.remove("active");
};

window.onclick = (e) => {
  if (e.target === itemDetailModal) itemDetailModal.classList.remove("active");
};

// Fitur Pencarian Produk
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

// Checkout
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

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  cart.items.splice(0, cart.items.length);
  cart.updateCart();
  cart.save();

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";

  shoppingCart.classList.remove("active");
  alert("Pesanan berhasil dikirim! Terima kasih " + name);
}

function showCartToast(name) {
  const toast = document.getElementById("cart-toast");
  toast.textContent = name + " ditambahkan ke keranjang!";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(2rem)";
  }, 2500);
}
