/* =====================================================
   CREATIVE JEWELLERY — main.js
   Shared initialization on every page.
   Provides: showToast(), showAuthPopup(), navbar, hamburger,
             cart badge, add-to-cart button wiring
   Depends on: storage.js (must load before this file)
   ===================================================== */

/* ── Toast Notifications ──────────────────────────── */
function showToast(message, type) {
  type = type || 'success';

  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span class="toast-msg">' + message + '</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>';
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(function () { toast.classList.add('toast-show'); });

  // Auto dismiss
  setTimeout(function () {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', function () { toast.remove(); }, { once: true });
  }, 3500);
}

/* Make globally available immediately */
window.showToast = showToast;

/* ── Auth Popup (guest tries to shop) ────────────── */
function showAuthPopup() {
  var overlay = document.getElementById('authPopupOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'authPopupOverlay';
    overlay.className = 'auth-popup-overlay';
    overlay.innerHTML = '\
      <div class="auth-popup-card fade-in-up">\
        <div class="auth-popup-icon">🔒</div>\
        <h2>Please Sign In to Continue Shopping</h2>\
        <p>You must sign in before adding items to your cart. Create an account or sign in to continue.</p>\
        <div class="auth-popup-actions">\
          <a href="login.html" class="btn btn-primary" id="popupLoginBtn">Login</a>\
          <a href="login.html?tab=signup" class="btn btn-outline" id="popupSignupBtn">Create Account</a>\
        </div>\
        <button class="auth-popup-close" id="authPopupClose" aria-label="Close">✕</button>\
      </div>';
    document.body.appendChild(overlay);

    document.getElementById('authPopupClose').addEventListener('click', hideAuthPopup);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hideAuthPopup();
    });
  }
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideAuthPopup() {
  var overlay = document.getElementById('authPopupOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.showAuthPopup = showAuthPopup;
window.hideAuthPopup = hideAuthPopup;

/* ── Cart Badge ───────────────────────────────────── */
function updateCartBadge() {
  var user = Storage.getCurrentUser();
  var cart = user ? Storage.getCart(user.email) : [];
  var totalQty = cart.reduce(function (sum, item) { return sum + (item.quantity || 1); }, 0);

  document.querySelectorAll('.cart-badge').forEach(function (el) {
    el.textContent = totalQty;
    el.style.display = totalQty > 0 ? 'inline-flex' : 'none';
  });

  // Also update text-based cart links
  document.querySelectorAll('.nav-cart-count').forEach(function (el) {
    el.textContent = totalQty > 0 ? ' (' + totalQty + ')' : '';
  });
}

window.updateCartBadge = updateCartBadge;

/* ── Navbar Auth Injection ────────────────────────── */
function initNavbar() {
  var user = Storage.getCurrentUser();
  var navLinksEl = document.getElementById('navLinks');
  if (!navLinksEl) return;

  // Remove old sign-in / cart links (will be replaced)
  navLinksEl.querySelectorAll('a[href="login.html"], a[href="card.html"], a[href="sign-in.html"]').forEach(function (el) { el.remove(); });
  // Also remove any text-only "Sign In" or "Cart" links
  navLinksEl.querySelectorAll('.nav-user-dropdown, .nav-cart-link').forEach(function (el) { el.remove(); });

  if (user) {
    // Logged-in: show user dropdown + cart
    var userDropdown = document.createElement('div');
    userDropdown.className = 'nav-user-dropdown';
    userDropdown.innerHTML = '\
      <button class="nav-user-btn" id="navUserBtn" aria-label="User menu">\
        <span class="nav-user-avatar">👤</span>\
        <span class="nav-user-name">Hi, ' + user.name.split(' ')[0] + '</span>\
        <span class="nav-user-caret">▾</span>\
      </button>\
      <div class="nav-user-menu" id="navUserMenu">\
        <a href="profile.html" class="nav-user-menu-item">👤 My Profile</a>\
        <a href="card.html" class="nav-user-menu-item">🛒 My Cart <span class="nav-cart-count"></span></a>\
        <a href="profile.html#orders" class="nav-user-menu-item">📦 Order History</a>\
        <a href="profile.html#wishlist" class="nav-user-menu-item">❤️ Wishlist</a>\
        <div class="nav-user-divider"></div>\
        <button class="nav-user-menu-item nav-logout-btn" id="navLogoutBtn">🚪 Logout</button>\
      </div>';
    navLinksEl.appendChild(userDropdown);

    // Cart icon with badge
    var cartLink = document.createElement('a');
    cartLink.href = 'card.html';
    cartLink.className = 'nav-cart-link';
    cartLink.innerHTML = '🛒 Cart <span class="cart-badge"></span>';
    navLinksEl.appendChild(cartLink);

    // Toggle dropdown
    document.getElementById('navUserBtn').addEventListener('click', function (e) {
      e.stopPropagation();
      document.getElementById('navUserMenu').classList.toggle('open');
    });
    document.addEventListener('click', function () {
      var menu = document.getElementById('navUserMenu');
      if (menu) menu.classList.remove('open');
    });

    // Logout
    document.getElementById('navLogoutBtn').addEventListener('click', function () {
      if (typeof window.logout === 'function') {
        window.logout();
      } else {
        Storage.clearCurrentUser();
        showToast('👋 You have been logged out.', 'success');
        setTimeout(function () { window.location.href = 'index.html'; }, 900);
      }
    });

  } else {
    // Guest: show Sign In link (no cart for guests)
    var signInLink = document.createElement('a');
    signInLink.href = 'login.html';
    signInLink.textContent = 'Sign In';
    navLinksEl.appendChild(signInLink);
  }

  updateCartBadge();
}

/* ── Wire Add-to-Cart Buttons ─────────────────────── */
function wireAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    // Avoid double-wiring
    if (btn.dataset.wired) return;
    btn.dataset.wired = 'true';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof CART !== 'undefined' && CART.addToCart) {
        CART.addToCart(btn);
      } else {
        // Fallback if cart.js not loaded yet
        showAuthPopup();
      }
    });
  });
}

/* ── Hamburger ────────────────────────────────────── */
function initHamburger() {
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () { navLinks.classList.toggle('open'); });
    // Close on link click (mobile)
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') navLinks.classList.remove('open');
    });
  }
}

/* ── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initHamburger();
  wireAddToCartButtons();

  // Restore "✓ Added to Cart" button states after cart.js loads
  // Use a small delay to ensure cart.js has initialized
  setTimeout(function () {
    if (typeof CART !== 'undefined' && CART.restoreButtonStates) {
      CART.restoreButtonStates();
    }
  }, 50);
});
