// Load JSON data dynamically
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    displayProducts(data);
    localStorage.setItem("products", JSON.stringify(data));
    updateCartCount();
  });

function displayProducts(products) {
  const catalog = document.getElementById("productCatalog");
  if (!catalog) return;
  catalog.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₦${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    catalog.appendChild(card);
  });
}

// Add to cart
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
  updateCartCount();
}

// Update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// Display cart items on cart.html
function displayCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartItemsDiv) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((id, index) => {
    const product = products.find(p => p.id === id);
    if (product) {
      total += product.price;
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" width="80">
        <span>${product.name} - ₦${product.price}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartItemsDiv.appendChild(itemDiv);
    }
  });

  cartTotal.textContent = "Total: ₦" + total;
}

// Remove item from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// Checkout button
function checkoutCart() {
  alert("Redirecting to payment...");
  payWithPaystack();
}

// Attach search AFTER header loads
function attachSearch() {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", e => {
      let products = JSON.parse(localStorage.getItem("products")) || [];
      let filtered = products.filter(p =>
        p.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      displayProducts(filtered);
    });
  }
}

// Paystack Payment Integration
function payWithPaystack() {
  let handler = PaystackPop.setup({
    key: 'pk_test_cbdfbe91c88db6788a62002e4f8ec5b972ba9740',
    email: 'customer@email.com',
    amount: 500000,
    currency: 'NGN',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      alert('Payment successful! Reference: ' + response.reference);
      localStorage.setItem("lastPaymentRef", response.reference);
    },
    onClose: function() {
      alert('Transaction was not completed.');
    }
  });
  handler.openIframe();
}

// Leaflet Map Integration
function initMap() {
  const storeLocation = [6.5244, 3.3792];
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const map = L.map('map').setView(storeLocation, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker(storeLocation)
    .addTo(map)
    .bindPopup("Nedu Phone Accessories Store")
    .openPopup();
}

// Reuse header and footer across pages
async function loadLayout() {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  if (header) {
    const res = await fetch("header.html");
    header.innerHTML = await res.text();
    updateCartCount();
    attachSearch(); // FIX: attach search after header loads
  }

  if (footer) {
    const res = await fetch("footer.html");
    footer.innerHTML = await res.text();

    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) homeBtn.addEventListener("click", () => window.location.href = "index.html");

    const shopBtn = document.getElementById("shopBtn");
    if (shopBtn) shopBtn.addEventListener("click", () => window.location.href = "shop.html");

    const supportBtn = document.getElementById("supportBtn");
    if (supportBtn) supportBtn.addEventListener("click", () => window.location.href = "support.html");

    const loyaltyBtn = document.getElementById("loyaltyBtn");
    if (loyaltyBtn) loyaltyBtn.addEventListener("click", () => window.location.href = "loyalty.html");
  }
}

// Load everything when page is ready
document.addEventListener("DOMContentLoaded", () => {
  loadLayout();
  initMap();
  displayCart(); // only runs on cart.html
});