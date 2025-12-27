const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "index.html";

const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const totalItemsEl = document.getElementById("total-items");
const totalPriceEl = document.getElementById("total-price");

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartItems.innerHTML = "";
    totalItemsEl.textContent = 0;
    totalPriceEl.textContent = "$0.00";
    return;
  }

  emptyCart.style.display = "none";
  cartItems.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}">
      <h4>${item.title}</h4>
      <p>$${item.price}</p>
      <button onclick="changeQty(${item.id}, -1)">-</button>
      ${item.quantity}
      <button onclick="changeQty(${item.id}, 1)">+</button>
      <button onclick="removeItem(${item.id})">Remove</button>
    `;

    cartItems.appendChild(div);
  });

  totalItemsEl.textContent = totalItems;
  totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
}

function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.id === id);

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

document.querySelector(".btn-checkout").onclick = () =>
  alert("Checkout flow here");

loadCart();
