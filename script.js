// script.js — Urban Core Fresh

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      mobile.style.display = mobile.style.display === 'block' ? 'none' : 'block';
    });
  }

  // Cart state
  const CART_KEY = 'uc_cart';
  const AUTH_KEY = 'uc_user';

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const setCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));
  const cartCountEl = document.querySelector('.cart-count');

  const renderCartCount = () => {
    if (cartCountEl) {
      const count = getCart().reduce((a, i) => a + i.qty, 0);
      cartCountEl.textContent = String(count);
    }
  };

  // Add to cart buttons
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = JSON.parse(btn.getAttribute('data-add'));
      const cart = getCart();
      const idx = cart.findIndex(i => i.id === item.id);
      if (idx >= 0) cart[idx].qty += 1;
      else cart.push({ ...item, qty: 1 });
      setCart(cart);
      renderCartCount();
    });
  });

  renderCartCount();

  // Carousel buttons
  const car = document.getElementById('deal-carousel');
  const left = document.querySelector('.car-btn.left');
  const right = document.querySelector('.car-btn.right');
  left?.addEventListener('click', () => car && (car.scrollLeft -= 300));
  right?.addEventListener('click', () => car && (car.scrollLeft += 300));

  // Auth mock: show user name or Login
  const user = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  const authSlot = document.getElementById('auth-slot');
  if (authSlot) {
    authSlot.textContent = user ? `Hi, ${user.name}` : 'Login';
    authSlot.href = user ? 'javascript:void(0)' : 'login.html';
    if (user) {
      authSlot.addEventListener('click', () => {
        if (confirm('Log out?')) {
          localStorage.removeItem(AUTH_KEY);
          window.location.reload();
        }
      });
    }
  }

  // Cart page logic
  const cartPage = document.getElementById('cart-page');
  if (cartPage) {
    const list = document.getElementById('cart-list');
    const totalEl = document.getElementById('cart-total');

    const renderCart = () => {
      const cart = getCart();
      list.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.qty;
        const row = document.createElement('div');
        row.className = 'product';
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1.6fr 0.6fr 0.6fr 0.6fr';
        row.style.alignItems = 'center';
        row.style.gap = '10px';
        row.innerHTML = `
          <div class="title">${item.name}</div>
          <div>₹${item.price}</div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn" data-dec="${item.id}">−</button>
            <span>${item.qty}</span>
            <button class="btn" data-inc="${item.id}">+</button>
          </div>
          <button class="btn" data-del="${item.id}">Remove</button>
        `;
        list.appendChild(row);
      });
      totalEl.textContent = `₹${total}`;
      renderCartCount();
    };

    // Handlers
    cartPage.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const idInc = t.getAttribute('data-inc');
      const idDec = t.getAttribute('data-dec');
      const idDel = t.getAttribute('data-del');
      let cart = getCart();

      if (idInc) {
        cart = cart.map(i => i.id === idInc ? { ...i, qty: i.qty + 1 } : i);
        setCart(cart); renderCart();
      }
      if (idDec) {
        cart = cart.map(i => i.id === idDec ? { ...i, qty: Math.max(1, i.qty - 1) } : i);
        setCart(cart); renderCart();
      }
      if (idDel) {
        cart = cart.filter(i => i.id !== idDel);
        setCart(cart); renderCart();
      }
    });

    renderCart();
  }

  // Login page
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('[name="email"]').value.trim();
      const pass = loginForm.querySelector('[name="password"]').value.trim();
      const name = email.split('@')[0];
      if (email && pass) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ email, name }));
        alert('Logged in!');
        window.location.href = 'index.html';
      }
    });
  }

  // Signup page
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupForm.querySelector('[name="name"]').value.trim();
      const email = signupForm.querySelector('[name="email"]').value.trim();
      const pass = signupForm.querySelector('[name="password"]').value.trim();
      if (name && email && pass) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ email, name }));
        alert('Account created!');
        window.location.href = 'index.html';
      }
    });
  }
});