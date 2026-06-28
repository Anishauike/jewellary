/* =====================================================
   CREATIVE JEWELLERY — toast.js
   Toast notification helper (non-module version)
   NOTE: The main showToast function is in main.js.
         This file is kept for backward compatibility
         but main.js's version takes priority.
   ===================================================== */

// If showToast is not already defined by main.js, define it here.
if (typeof window.showToast !== 'function') {
  window.showToast = function (message, type) {
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

    requestAnimationFrame(function () {
      toast.classList.add('toast-show');
    });

    setTimeout(function () {
      toast.classList.remove('toast-show');
      toast.addEventListener('transitionend', function () { toast.remove(); }, { once: true });
    }, 3500);
  };
}
