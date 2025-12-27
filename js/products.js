// auth check
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "index.html";

document.getElementById("user-name").textContent = `Hello, ${currentUser.name}`;
document.getElementById("logout-btn").onclick = () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
};

const loader = document.getElementById("loader");
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let products = [];

loader.style.display = "block";

// fetch products
fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((data) => {
    products = data;
    loadCategories();
    displayProducts(products);
  })
  .catch(() => {
    loader.textContent = "Failed to load products";
  })
  .finally(() => {
    loader.style.display = "none";
  });

function loadCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function displayProducts(list) {
  productContainer.innerHTML = "";

  list.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${product.image}">
      <h4>${product.title}</h4>
      <p>$${product.price}</p>
      <p>${product.category}</p>
      <button type="button">Add to Cart</button>
    `;

    div.querySelector("button").onclick = () => addToCart(product);
    productContainer.appendChild(div);
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function filterProducts() {
  const text = searchInput.value.toLowerCase();
  const cat = categoryFilter.value;

  let filtered = products.filter((p) => p.title.toLowerCase().includes(text));

  if (cat) filtered = filtered.filter((p) => p.category === cat);

  displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
