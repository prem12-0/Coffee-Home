let reservationData = {
  name: "Guest",
  guests: "-",
  date: "-",
  time: "-",
  phone: "",
  tableNumber: Math.floor(Math.random() * 20) + 1,
  orderNumber: null,
  grandTotal: 0,
};

function setReservationInfo() {
  const params = new URLSearchParams(window.location.search);

  reservationData.name = params.get("name") || "Guest";
  reservationData.guests = params.get("guests") || "-";
  reservationData.date = params.get("date") || "-";
  reservationData.time = params.get("time") || "-";
  reservationData.phone = params.get("phone") || "";

  const infoEl = document.getElementById("reservation-info");
  if (infoEl) {
    infoEl.textContent = `Reservation for ${reservationData.name} on ${reservationData.date} at ${reservationData.time} for ${reservationData.guests} people.`;
  }
}

function calculateBill() {
  let menu = [
    {
      item: "Filter Kaapi",
      price: 50,
      checkbox: "item-filter-kaapi",
      qty: "qty-filter-kaapi",
    },
    {
      item: "Masala Chai",
      price: 20,
      checkbox: "item-masala-chai",
      qty: "qty-masala-chai",
    },
    {
      item: "Cold Coffee",
      price: 40,
      checkbox: "item-cold-coffee",
      qty: "qty-cold-coffee",
    },
    {
      item: "Badam Milk",
      price: 75,
      checkbox: "item-badam-milk",
      qty: "qty-badam-milk",
    },
    { item: "Samosa", price: 10, checkbox: "item-samosa", qty: "qty-samosa" },
    {
      item: "Egg Puff",
      price: 25,
      checkbox: "item-egg-puff",
      qty: "qty-egg-puff",
    },
  ];

  let subtotal = 0;
  let billItems = "";
  let addedSomething = false;

  menu.forEach((product) => {
    let checkbox = document.getElementsByName(product.checkbox)[0];
    let qtyInput = document.getElementsByName(product.qty)[0];

    if (!checkbox || !qtyInput) return;

    let selected = checkbox.checked;
    let qty = parseInt(qtyInput.value, 10);

    if (selected && qty > 0) {
      addedSomething = true;
      let itemTotal = product.price * qty;
      subtotal += itemTotal;

      billItems += `
        <li>
          <span>${product.item} × ${qty}</span>
          <span>₹ ${itemTotal}</span>
        </li>
      `;
    }
  });

  if (!addedSomething) {
    alert("Please select at least one item!");
    return;
  }

  const gstRate = 0.05;
  const gstAmount = Math.round(subtotal * gstRate);
  const grandTotal = subtotal + gstAmount;

  reservationData.grandTotal = grandTotal;

  const now = new Date();
  const orderNumber = "CH-" + now.getTime().toString().slice(-6);
  reservationData.orderNumber = orderNumber;

  const billItemsEl = document.getElementById("bill-items");
  const subtotalEl = document.getElementById("subtotal-amount");
  const gstEl = document.getElementById("gst-amount");
  const grandTotalEl = document.getElementById("grand-total-amount");
  const billBoxEl = document.getElementById("bill-box");
  const orderNumberEl = document.getElementById("order-number");
  const billDateEl = document.getElementById("bill-date");

  if (
    !billItemsEl ||
    !subtotalEl ||
    !gstEl ||
    !grandTotalEl ||
    !billBoxEl ||
    !orderNumberEl ||
    !billDateEl
  ) {
    return;
  }

  billItemsEl.innerHTML = billItems;
  subtotalEl.textContent = subtotal;
  gstEl.textContent = gstAmount;
  grandTotalEl.textContent = grandTotal;

  billDateEl.textContent = now.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  orderNumberEl.textContent = `Order No: ${orderNumber}`;

  billBoxEl.style.display = "block";
}

function openPaymentModal() {
  if (!reservationData.grandTotal || reservationData.grandTotal <= 0) {
    alert("Please create the bill first by clicking 'Order Now'.");
    return;
  }

  const modal = document.getElementById("payment-modal");
  const nameEl = document.getElementById("payment-customer");
  const tableEl = document.getElementById("payment-table");
  const amountEl = document.getElementById("payment-amount");

  if (nameEl) {
    nameEl.textContent = `Table reserved in the name of ${reservationData.name}`;
  }
  if (tableEl) {
    tableEl.textContent = `Table No: ${reservationData.tableNumber}`;
  }
  if (amountEl) {
    amountEl.textContent = `Amount to pay at counter: ₹ ${reservationData.grandTotal}`;
  }

  if (modal) {
    modal.style.display = "flex";
  }

  const sound = document.getElementById("success-sound");
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  setTimeout(() => {
    const code =
      reservationData.orderNumber ||
      "CH-R" + Math.floor(100000 + Math.random() * 900000);

    const url =
      "thankyou.html?name=" +
      encodeURIComponent(reservationData.name) +
      "&table=" +
      encodeURIComponent(reservationData.tableNumber) +
      "&phone=" +
      encodeURIComponent(reservationData.phone) +
      "&guests=" +
      encodeURIComponent(reservationData.guests) +
      "&date=" +
      encodeURIComponent(reservationData.date) +
      "&time=" +
      encodeURIComponent(reservationData.time) +
      "&code=" +
      encodeURIComponent(code);

    window.location.href = url;
  }, 3000);
}

function closePaymentModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

function downloadReceipt() {
  const bill = document.querySelector(".bill-box");
  if (!bill) {
    alert("Please generate the bill first.");
    return;
  }
  window.print();
}

/* ---- Reservation summary on index.html ---- */

function initReservationSummary() {
  const nameInput = document.getElementById("name");
  const guestsSelect = document.getElementById("guests");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const seatingSelect = document.getElementById("seating");
  const occasionSelect = document.getElementById("occasion");

  const nameOut = document.getElementById("summary-name");
  const guestsOut = document.getElementById("summary-guests");
  const dateOut = document.getElementById("summary-date");
  const timeOut = document.getElementById("summary-time");
  const seatingOut = document.getElementById("summary-seating");
  const occasionOut = document.getElementById("summary-occasion");

  if (
    !nameInput ||
    !guestsSelect ||
    !dateInput ||
    !timeInput ||
    !seatingSelect ||
    !occasionSelect ||
    !nameOut ||
    !guestsOut ||
    !dateOut ||
    !timeOut ||
    !seatingOut ||
    !occasionOut
  ) {
    return; // not on index.html
  }

  function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(value) {
    if (!value) return "—";
    const [h, m] = value.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return value;
    let suffix = "AM";
    let hour = h;
    if (hour === 0) hour = 12;
    if (hour >= 12) {
      suffix = "PM";
      if (hour > 12) hour -= 12;
    }
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
  }

  function update() {
    nameOut.textContent = nameInput.value || "—";

    const guestsText =
      guestsSelect.value === ""
        ? "—"
        : guestsSelect.options[guestsSelect.selectedIndex].textContent;
    guestsOut.textContent = guestsText;

    dateOut.textContent = formatDate(dateInput.value);
    timeOut.textContent = formatTime(timeInput.value);

    const seatingText =
      seatingSelect.value === ""
        ? "No preference"
        : seatingSelect.options[seatingSelect.selectedIndex].textContent;
    seatingOut.textContent = seatingText;

    const occText =
      occasionSelect.value === ""
        ? "Casual visit"
        : occasionSelect.options[occasionSelect.selectedIndex].textContent;
    occasionOut.textContent = occText;
  }

  [nameInput, dateInput, timeInput].forEach((el) =>
    el.addEventListener("input", update)
  );
  [guestsSelect, seatingSelect, occasionSelect].forEach((el) =>
    el.addEventListener("change", update)
  );

  update();
}

/* ---- Scroll reveal ---- */

function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  setReservationInfo();
  initReservationSummary();
  initScrollReveal();
});
