let products = JSON.parse(localStorage.getItem("products")) || [];

// Save products to localStorage
function saveToLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Show toast notification
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-primary border-0 show mb-2';
  toast.role = 'alert';
  toast.ariaLive = 'assertive';
  toast.ariaAtomic = 'true';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// Add item to cart and combine quantities
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(p => p.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${item.title} added to cart!`);
}

// Update cart count in navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = totalCount;
}

// Show loading spinner
function showSpinner() {
  const productDisplay = document.querySelector(".carousel-inner");
  productDisplay.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;
}

// Show error with Retry
function showError(message) {
  const productDisplay = document.querySelector(".carousel-inner");
  productDisplay.innerHTML = `
    <div class="alert alert-danger text-center" role="alert">
      ${message}<br>
      <button class="btn btn-danger mt-2" id="retry-btn">Retry</button>
    </div>`;

  document.getElementById("retry-btn").addEventListener("click", () => {
    displayProducts();
  });
}

// Fetch products
async function displayProducts() {
  showSpinner();
  try {
    const incoming = await fetch("/json/product.json");
    const store = await incoming.json();
    if (Array.isArray(store) && store.length > 0) {
      products = store;
      saveToLocalStorage();
    }
    logger();
  } catch (error) {
    if (products.length === 0) {
      showError("Failed to load products. Please try again.");
    } else {
      logger();
    }
  }
}

// Render carousel
function logger() {
  const productDisplay = document.querySelector(".carousel-inner");
  productDisplay.innerHTML = "";
  if (products.length === 0) {
    showError("No products available.");
    return;
  }
  products.forEach((element, index) => {
    const isActive = index === 0 ? "active" : "";
    productDisplay.innerHTML += `
      <div class="carousel-item ${isActive}">
        <img src="${element.image}" class="img d-block w-90" alt="${element.title}">
        <div>${element.title}</div>
      </div>`;
  });
}

// Display cloth products
function displayCloth() {
  const row = document.querySelector(".Cloth");
  const clothItems = products.filter(el => el.type === "cloth");

  row.innerHTML = "";
  if (clothItems.length === 0) {
    row.innerHTML = "<p>No cloth items available.</p>";
    return;
  }

  let currentIndex = 1;
  function renderCloth(count) {
    row.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const item = clothItems[i];
      row.innerHTML += `
        <section class="border m-2 p-2 rounded">
          <div class="total">
            <img src="${item.image}" class="imgs" alt="${item.title}">
            <div>${item.title}</div>
            <h4>$${Number(item.price).toFixed(2)}</h4>
            <button class="add-btn btn btn-success m-1">Add</button>
          </div>
        </section>`;
    }

    if (count < clothItems.length) {
      row.innerHTML += `<button class="more-btn btn btn-primary m-1">More</button>`;
    }
    if (count > 1) {
      row.innerHTML += `<button class="back-btn btn btn-secondary m-1">Back</button>`;
    }

    row.querySelectorAll(".add-btn").forEach((btn, idx) => {
      btn.addEventListener("click", () => addToCart(clothItems[idx]));
    });

    const moreBtn = row.querySelector(".more-btn");
    if (moreBtn) {
      moreBtn.addEventListener("click", () => {
        currentIndex = Math.min(currentIndex + 5, clothItems.length);
        renderCloth(currentIndex);
      });
    }

    const backBtn = row.querySelector(".back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        currentIndex = 1;
        renderCloth(currentIndex);
      });
    }
  }
  renderCloth(currentIndex);
}

// Display electronic products
function displayElectronics() {
  const row = document.querySelector(".Elect");
  const electItems = products.filter(el => el.type === "electronic");

  row.innerHTML = "";
  if (electItems.length === 0) {
    row.innerHTML = "<p>No electronic items available.</p>";
    return;
  }

  let currentIndex = 1;
  function renderElectronics(count) {
    row.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const item = electItems[i];
      row.innerHTML += `
        <section class="border m-2 p-2 rounded">
          <div class="total">
            <img src="${item.image}" class="imgs" alt="${item.title}">
            <div>${item.title}</div>
            <h4>$${Number(item.price).toFixed(2)}</h4>
            <button class="add-btn btn btn-success m-1">Add</button>
          </div>
        </section>`;
    }

    if (count < electItems.length) {
      row.innerHTML += `<button class="more-btn btn btn-primary m-1">More</button>`;
    }
    if (count > 1) {
      row.innerHTML += `<button class="back-btn btn btn-secondary m-1">Back</button>`;
    }

    row.querySelectorAll(".add-btn").forEach((btn, idx) => {
      btn.addEventListener("click", () => addToCart(electItems[idx]));
    });

    const moreBtn = row.querySelector(".more-btn");
    if (moreBtn) {
      moreBtn.addEventListener("click", () => {
        currentIndex = Math.min(currentIndex + 5, electItems.length);
        renderElectronics(currentIndex);
      });
    }

    const backBtn = row.querySelector(".back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        currentIndex = 1;
        renderElectronics(currentIndex);
      });
    }
  }
  renderElectronics(currentIndex);
}

// On page load
document.addEventListener("DOMContentLoaded", function () {
  displayCloth();
  displayElectronics();
  displayProducts();
  updateCartCount();
});
