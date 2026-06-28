/* =====================================================
   CREATIVE JEWELLERY — cart.js
   Cart management: add, remove, update, restore states
   Depends on: storage.js, main.js (showToast, showAuthPopup, updateCartBadge)
   ===================================================== */

(function () {
  'use strict';

  /* ── Add to Cart ───────────────────────────────── */
  function addToCart(btn) {
    if (!btn) return;

    // Auth check — guest cannot add
    var user = Storage.getCurrentUser();
    if (!user) {
      showAuthPopup();
      return;
    }

    // Read product data from button attributes
    var productId    = btn.getAttribute('data-product-id');
    var productName  = btn.getAttribute('data-product-name');
    var productImage = btn.getAttribute('data-product-image');
    var productPrice = parseFloat(btn.getAttribute('data-product-price'));

    if (!productId || !productName || isNaN(productPrice)) {
      showToast('❌ Could not add product.', 'error');
      return;
    }

    // Get current cart for this user
    var cart = Storage.getCart(user.email);

    // Check if already in cart
    var existing = cart.find(function (item) { return item.id === productId; });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: 1
      });
    }

    Storage.saveCart(user.email, cart);

    // Update button to "✓ Added to Cart"
    markButtonAdded(btn);

    // Update cart badge
    updateCartBadge();

    showToast('✅ ' + productName + ' added to cart.', 'success');
  }

  /* ── Mark button as "Added" ────────────────────── */
  function markButtonAdded(btn) {
    btn.innerHTML = '<span class="btn-check">✓</span> Added to Cart';
    btn.disabled = true;
    btn.classList.add('btn-added');
  }

  /* ── Reset button to "Add to Cart" ─────────────── */
  function markButtonDefault(btn) {
    btn.innerHTML = 'Add to Cart';
    btn.disabled = false;
    btn.classList.remove('btn-added');
  }

  /* ── Restore button states on page load ────────── */
  function restoreButtonStates() {
    var user = Storage.getCurrentUser();
    if (!user) return;

    var cart = Storage.getCart(user.email);
    var cartIds = cart.map(function (item) { return item.id; });

    document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
      var pid = btn.getAttribute('data-product-id');
      if (pid && cartIds.indexOf(pid) !== -1) {
        markButtonAdded(btn);
      } else {
        markButtonDefault(btn);
      }
    });
  }

  /* ── Update quantity (from cart page) ───────────── */
  function updateCartQuantity(productId, delta) {
    var user = Storage.getCurrentUser();
    if (!user) return;

    var cart = Storage.getCart(user.email);
    var item = cart.find(function (i) { return i.id === productId; });
    if (!item) return;

    item.quantity += delta;
    if (item.quantity < 1) item.quantity = 1;

    Storage.saveCart(user.email, cart);
    updateCartBadge();
  }

  /* ── Remove item from cart ─────────────────────── */
  function removeFromCart(productId) {
    var user = Storage.getCurrentUser();
    if (!user) return;

    var cart = Storage.getCart(user.email);
    var idx = cart.findIndex(function (i) { return i.id === productId; });
    if (idx > -1) {
      cart.splice(idx, 1);
      Storage.saveCart(user.email, cart);
      updateCartBadge();
    }
  }

  /* ── Clear entire cart for current user ─────────── */
  function clearUserCart() {
    var user = Storage.getCurrentUser();
    if (!user) return;
    Storage.clearCart(user.email);
    updateCartBadge();
  }

  /* ── Expose globally ───────────────────────────── */
  window.CART = {
    addToCart: addToCart,
    restoreButtonStates: restoreButtonStates,
    updateCartQuantity: updateCartQuantity,
    removeFromCart: removeFromCart,
    clearUserCart: clearUserCart,
    markButtonAdded: markButtonAdded,
    markButtonDefault: markButtonDefault
  };

})();
