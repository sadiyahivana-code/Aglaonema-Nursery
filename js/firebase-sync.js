(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyBYimpJRRBUhyqy4qdilLPIDXaCOyO-RU4",
    authDomain: "aglaonema-nursery.firebaseapp.com",
    databaseURL:
      "https://aglaonema-nursery-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aglaonema-nursery",
    storageBucket: "aglaonema-nursery.firebasestorage.app",
    messagingSenderId: "140962120744",
    appId: "1:140962120744:web:a0ec2064b2cb7e06e5a11d",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  window.firebaseDB = db;

  // Fungsi Checkout
  window.submitCheckout = function () {
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

    // Validasi stok products
    const stockChecks = cart.items.map(function (item) {
      return db
        .ref("products/" + item.id)
        .get()
        .then(function (snap) {
          const product = snap.val();
          const stokTersedia = product?.stock ?? 999;
          if (item.qty > stokTersedia) {
            return item.name + " (stok tersisa " + stokTersedia + ")";
          }
          return null;
        });
    });

    Promise.all(stockChecks).then(function (results) {
      const kurang = results.filter(Boolean);
      if (kurang.length > 0) {
        alert("Stok tidak cukup untuk:\n" + kurang.join("\n"));
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

      db.ref("orders/" + order.id).set(order);

      // Kurangi stok setiap produk yang dibeli
      cart.items.forEach(function (item) {
        const prodRef = db.ref("products/" + item.id);
        prodRef.transaction(function (product) {
          if (product) {
            product.stock = Math.max(0, (product.stock || 0) - item.qty);
          }
          return product;
        });
      });

      cart.items.splice(0, cart.items.length);
      cart.updateCart();
      cart.save();

      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone").value = "";

      document.querySelector(".shopping-cart").classList.remove("active");
      alert("Pesanan berhasil dikirim! Terima kasih " + name);
    });
  };
})();
