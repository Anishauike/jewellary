/* =====================================================
   CREATIVE JEWELLERY — checkout.js
   Checkout page logic
   Depends on: storage.js, main.js, cart.js, receipt.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Auth Guard ─────────────────────────────────── */
  const user = Storage.getCurrentUser();
  if (!user) {
    sessionStorage.setItem('cj_redirect_after_login', 'payment.html');
    showToast('❌ Please sign in to proceed to checkout.', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }

  /* ── Pre-fill customer info ─────────────────────── */
  const nameParts = user.name.split(' ');
  const fnameEl = document.getElementById('pfname');
  const lnameEl = document.getElementById('plname');
  const emailEl = document.getElementById('pemail');

  if (fnameEl) fnameEl.value = nameParts[0] || '';
  if (lnameEl) lnameEl.value = nameParts.slice(1).join(' ') || '';
  if (emailEl) emailEl.value = user.email || '';

  /* ── Load cart & render order summary ───────────── */
  function loadOrderSummary() {
    const cart   = Storage.getCart(user.email);
    const wrap   = document.getElementById('summaryItems');
    if (!wrap) return;

    let total = 0;

    if (cart.length === 0) {
      wrap.innerHTML = '<p class="empty-summary">Your cart is empty. <a href="product.html">Shop now</a></p>';
      setTotals(0);
      return;
    }

    wrap.innerHTML = cart.map(item => {
      const sub = item.price * (item.quantity || 1);
      total += sub;
      return `
        <div class="summary-item">
          <img src="${item.image}" alt="${item.name}" class="summary-item-img" onerror="this.src='images/necklace 1.jpeg'">
          <div class="summary-item-info">
            <span class="summary-item-name">${item.name}</span>
            <span class="summary-item-qty">Qty: ${item.quantity || 1}</span>
          </div>
          <span class="summary-item-price">$${sub.toFixed(2)}</span>
        </div>`;
    }).join('');

    setTotals(total);
  }

  function setTotals(total) {
    const shipping = total > 0 ? 0 : 0; // Free shipping
    const grand    = total + shipping;
    const subtotalEl = document.getElementById('summarySubtotal');
    const totalEl    = document.getElementById('summaryTotal');
    if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
    if (totalEl)    totalEl.textContent    = `$${grand.toFixed(2)}`;
  }

  loadOrderSummary();

  /* ── Payment Method Toggle ──────────────────────── */
  const paymentSelect    = document.getElementById('paymentMethod');
  const creditCardForm   = document.getElementById('creditCardForm');
  const paypalForm       = document.getElementById('paypalForm');
  const bankTransferForm = document.getElementById('bankTransferForm');

  if (paymentSelect) {
    paymentSelect.addEventListener('change', function () {
      [creditCardForm, paypalForm, bankTransferForm].forEach(f => {
        if (f) f.style.display = 'none';
      });
      if (this.value === 'credit_card' && creditCardForm)   creditCardForm.style.display   = 'block';
      if (this.value === 'paypal'       && paypalForm)       paypalForm.style.display       = 'block';
      if (this.value === 'bank_transfer'&& bankTransferForm) bankTransferForm.style.display = 'block';
    });
  }

  /* ── Card number formatting ─────────────────────── */
  const ccNum = document.getElementById('ccNumber');
  if (ccNum) {
    ccNum.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    });
  }

  /* ── Form submit → Place Order ──────────────────── */
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fname   = document.getElementById('pfname')?.value.trim();
      const lname   = document.getElementById('plname')?.value.trim();
      const email   = document.getElementById('pemail')?.value.trim();
      const phone   = document.getElementById('pphone')?.value.trim();
      const address = document.getElementById('paddress')?.value.trim();
      const payment = document.getElementById('paymentMethod')?.value;

      if (!fname || !email || !phone || !address || !payment) {
        showToast('❌ Please fill in all required fields.', 'error');
        return;
      }

      const cart = Storage.getCart(user.email);
      if (cart.length === 0) {
        showToast('❌ Your cart is empty!', 'error');
        return;
      }

      const total    = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
      const receiptNo = Math.floor(1000 + Math.random() * 9000);
      const orderDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      });

      const order = {
        receiptNo,
        date:      orderDate,
        items:     [...cart],
        total,
        customer:  { name: `${fname} ${lname}`.trim(), email, phone, address },
        payment:   payment.replace('_', ' '),
      };

      // Save order
      Storage.saveOrder(user.email, order);

      // Clear cart
      Storage.clearCart(user.email);
      updateCartBadge();

      // Generate PDF receipt
      if (typeof generateReceipt === 'function') {
        generateReceipt(order);
      }

      // Show success modal
      showOrderSuccess(order);
    });
  }

  /* ── Success Modal ──────────────────────────────── */
  function showOrderSuccess(order) {
    const modal = document.getElementById('orderSuccessModal');
    if (!modal) return;

    const numEl  = modal.querySelector('#successReceiptNo');
    const dateEl = modal.querySelector('#successDate');
    const totalEl= modal.querySelector('#successTotal');

    if (numEl)   numEl.textContent   = `#${order.receiptNo}`;
    if (dateEl)  dateEl.textContent  = order.date;
    if (totalEl) totalEl.textContent = `$${order.total.toFixed(2)}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-download receipt button
    const dlBtn = modal.querySelector('#redownloadReceipt');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        if (typeof generateReceipt === 'function') generateReceipt(order);
      });
    }

    // Return home
    const homeBtn = modal.querySelector('#returnHome');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }
});
