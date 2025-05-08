
document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cartItems");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="color:red;">Your cart is empty.</p>`;
        return;
    }

    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("card", "mb-3", "p-3");

        itemDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.title}" class="me-3" style="width: 80px; height: 80px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h5>${item.title}</h5>
                    <p class="mb-1">$${Number(item.price).toFixed(2)}</p>
                </div>
                <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
            </div>
        `;

        cartContainer.appendChild(itemDiv);
    });

    cartContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            showToast("Item removed from cart");
            setTimeout(() => location.reload(), 800);
        }
    });
});


function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-bg-success border-0 show mb-2';
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
  }
  
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cart.length;
  }
  
  function loadCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    cartItemsContainer.innerHTML = '';
    let total = 0;
  
    // Group items by ID
    const groupedCart = cart.reduce((acc, item) => {
      acc[item.id] = acc[item.id] || { ...item, quantity: 0 };
      acc[item.id].quantity += 1;
      return acc;
    }, {});
  
    Object.values(groupedCart).forEach((item) => {
      const itemTotal = Number(item.price) * item.quantity;
      total += itemTotal;
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.title}</td>
        <td>$${Number(item.price).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-secondary decrease-btn" data-id="${item.id}">-</button>
          ${item.quantity}
          <button class="btn btn-sm btn-secondary increase-btn" data-id="${item.id}">+</button>
        </td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}">Remove</button>
        </td>`;
      cartItemsContainer.appendChild(row);
    });
  
    cartTotalEl.textContent = total.toFixed(2);
    updateCartCount();
  
    // Button listeners
    document.querySelectorAll('.increase-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const product = cart.find(p => p.id == id);
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
      });
    });
  
    document.querySelectorAll('.decrease-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const index = cart.findIndex(p => p.id == id);
        if (index > -1) {
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          loadCart();
        }
      });
    });
  
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        cart = cart.filter(p => p.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
        showToast('Item removed from cart');
        loadCart();
      });
    });
  }
  
  // Checkout button
  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
  
    const checkoutBtn = document.querySelector('.btn-success');
    checkoutBtn.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      alert('Proceeding to checkout! (You can replace this with a real checkout page)');
      // Optionally clear the cart
      // localStorage.removeItem('cart');
      // loadCart();
    });
  
    // Optional: add clear cart button dynamically
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Cart';
    clearBtn.classList.add('btn', 'btn-warning', 'ms-2');
    checkoutBtn.parentNode.appendChild(clearBtn);
  
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('cart');
      showToast('Cart cleared!');
      loadCart();
    });
  });
  
  
  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
  });
  
