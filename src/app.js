document.addEventListener("alpine:init", () => {
  // Data Produk
  Alpine.data("Products", () => ({
    items: [
      {
        id: 1,
        name: "Aglaonema Adelina",
        img: "img/Aglaonema-adelina.jpg",
        price: 80000,
        oldPrice: 0,
        stars: 0,
        desc: "Aglaonema Adelina memiliki tampilan elegan dengan warna daun yang cantik, cocok untuk dekorasi ruangan.",
      },
      {
        id: 2,
        name: "Aglaonema Bidadari",
        img: "img/Aglaonema-bidadari.jpg",
        price: 115000,
        oldPrice: 130000,
        stars: 4,
        desc: "Warna lembut dan menawan, cocok untuk mempercantik ruangan rumah.",
      },
      {
        id: 3,
        name: "Aglaonema Hot Lady",
        img: "img/Aglaonema-hot-lady.jpg",
        price: 120000,
        oldPrice: 135000,
        stars: 4,
        desc: "Daun merah menyala yang sangat menarik perhatian.",
      },
      {
        id: 4,
        name: "Aglaonema Khanza",
        img: "img/Aglaonema-khanza.jpg",
        price: 135000,
        oldPrice: 150000,
        stars: 5,
        desc: "Tanaman premium dengan tampilan eksotis dan elegan.",
      },
      {
        id: 5,
        name: "Aglaonema Kochin",
        img: "img/Aglaonema-kochin-red.jpg",
        price: 125000,
        oldPrice: 140000,
        stars: 4,
        desc: "Kombinasi merah dan hijau yang elegan dan segar.",
      },
      {
        id: 6,
        name: "Aglaonema Lipstick",
        img: "img/Aglaonema-lipstick.jpg",
        price: 60000,
        oldPrice: 0,
        stars: 0,
        desc: "Daun unik seperti sapuan warna lipstick merah.",
      },
      {
        id: 7,
        name: "Aglaonema Lotus",
        img: "img/Aglaonema-lotus.jpg",
        price: 170000,
        oldPrice: 190000,
        stars: 5,
        desc: "Tampilan mewah dengan daun yang kuat dan indah.",
      },
      {
        id: 8,
        name: "Aglaonema Merah",
        img: "img/Aglaonema-merah.jpg",
        price: 90000,
        oldPrice: 0,
        stars: 0,
        desc: "Dominasi warna merah yang kuat dan menarik perhatian.",
      },
      {
        id: 9,
        name: "Aglaonema Moonlight",
        img: "img/Aglaonema-moonlight.jpg",
        price: 95000,
        oldPrice: 0,
        stars: 0,
        desc: "Warna lembut seperti cahaya bulan yang menenangkan.",
      },
      {
        id: 10,
        name: "Aglaonema Silver Bay",
        img: "img/Aglaonema-silver-bay.jpg",
        price: 85000,
        oldPrice: 0,
        stars: 0,
        desc: "Daun hijau keperakan yang elegan dan modern.",
      },
    ],

    // Sinkronisasi Data Produk dari Firebase
    init() {
      const self = this;
      function syncFromFirebase() {
        if (window.firebaseDB) {
          window.firebaseDB.ref("products").on("value", function (snap) {
            if (snap.exists()) {
              const fromDB = snap.val();
              const dbItems = Object.keys(fromDB)
                .map((key) => fromDB[key])
                .filter((item) => item !== null)
                .map((dbItem) => {
                  const local = self.items.find((i) => i.id === dbItem.id);
                  return {
                    ...dbItem,
                    oldPrice: local?.oldPrice || 0,
                    desc: local?.desc || "",
                    stars: local?.stars || 0,
                  };
                });
              self.items = dbItems;
            }
            setTimeout(() => feather.replace(), 300);
          });
        } else {
          setTimeout(syncFromFirebase, 200);
        }
      }
      syncFromFirebase();
    },
  }));

  // Keranjang Belanja
  Alpine.store("cart", {
    items: JSON.parse(localStorage.getItem("cart")) || [],
    total: 0,
    quantity: 0,

    init() {
      this.updateCart();
    },

    get count() {
      return this.quantity;
    },

    save() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    updateCart() {
      this.quantity = this.items.reduce((sum, item) => sum + item.qty, 0);
      this.total = this.items.reduce((sum, item) => sum + item.total, 0);
    },

    add(newItem) {
      const existing = this.items.find((item) => item.id === newItem.id);
      if (existing) {
        existing.qty++;
        existing.total = existing.qty * existing.price;
      } else {
        this.items.push({ ...newItem, qty: 1, total: newItem.price });
      }
      this.updateCart();
      this.save();
      showCartToast(newItem.name);
    },

    remove(index) {
      this.items.splice(index, 1);
      this.updateCart();
      this.save();
    },

    increment(index) {
      this.items[index].qty++;
      this.items[index].total = this.items[index].qty * this.items[index].price;
      this.updateCart();
      this.save();
    },

    decrement(index) {
      if (this.items[index].qty > 1) {
        this.items[index].qty--;
        this.items[index].total =
          this.items[index].qty * this.items[index].price;
      } else {
        this.items.splice(index, 1);
      }
      this.updateCart();
      this.save();
    },
  });

  Alpine.store("cart").init();
});
