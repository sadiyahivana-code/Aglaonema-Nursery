document.addEventListener("alpine:init", () => {
  Alpine.data("Products", () => ({
    items: [
      {
        id: 1,
        name: "Aglaonema Adelina",
        img: "img/Aglaonema-adelina.jpg",
        price: 80000,
      },
      {
        id: 2,
        name: "Aglaonema Bidadari",
        img: "img/Aglaonema-bidadari.jpg",
        price: 115000,
      },
      {
        id: 3,
        name: "Aglaonema Hot Lady",
        img: "img/Aglaonema-hot-lady.jpg",
        price: 120000,
      },
      {
        id: 4,
        name: "Aglaonema Khanza",
        img: "img/Aglaonema-khanza.jpg",
        price: 135000,
      },
      {
        id: 5,
        name: "Aglaonema Kochin",
        img: "img/Aglaonema-kochin-red.jpg",
        price: 125000,
      },
      {
        id: 6,
        name: "Aglaonema Lipstick",
        img: "img/Aglaonema-lipstick.jpg",
        price: 60000,
      },
      {
        id: 7,
        name: "Aglaonema Lotus",
        img: "img/Aglaonema-lotus.jpg",
        price: 170000,
      },
      {
        id: 8,
        name: "Aglaonema Merah",
        img: "img/Aglaonema-merah.jpg",
        price: 90000,
      },
      {
        id: 9,
        name: "Aglaonema Moonlight",
        img: "img/Aglaonema-moonlight.jpg",
        price: 95000,
      },
      {
        id: 10,
        name: "Aglaonema Silver Bay",
        img: "img/Aglaonema-silver-bay.jpg",
        price: 85000,
      },
    ],
  }));

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
        this.items.push({
          ...newItem,
          qty: 1,
          total: newItem.price,
        });
      }

      this.updateCart();
      this.save();
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
