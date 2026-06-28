/* =====================================================
   CREATIVE JEWELLERY — auth.js
   Authentication: sign-up, sign-in, session, logout
   Depends on: storage.js, main.js (showToast)
   ===================================================== */

(function () {
  'use strict';

  /* ── Helpers ────────────────────────────────────── */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── Sign Up ───────────────────────────────────── */
  function handleSignUp(e) {
    e.preventDefault();

    const name     = (document.getElementById('signupName')    || {}).value || '';
    const email    = (document.getElementById('signupEmail')   || {}).value || '';
    const password = (document.getElementById('signupPassword')|| {}).value || '';
    const confirm  = (document.getElementById('signupConfirm') || {}).value || password;

    // Validation
    if (!name.trim()) {
      showToast('❌ Please enter your name.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showToast('❌ Please enter a valid email address.', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('❌ Password must be at least 8 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('❌ Passwords do not match.', 'error');
      return;
    }

    // Check duplicate
    const users = Storage.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      showToast('❌ Email already exists. Please sign in.', 'error');
      return;
    }

    // Save new user (plain password — frontend-only demo)
    users.push({ name: name.trim(), email: email.trim().toLowerCase(), password: password });
    Storage.saveUsers(users);

    // Do NOT auto-login. Redirect to login page with success message.
    showToast('✅ Account created successfully. Please sign in.', 'success');
    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1200);
  }

  /* ── Sign In ───────────────────────────────────── */
  function handleSignIn(e) {
    e.preventDefault();

    const email    = (document.getElementById('loginEmail')    || {}).value || '';
    const password = (document.getElementById('loginPassword') || {}).value || '';

    if (!email.trim() || !password) {
      showToast('❌ Please fill all required fields.', 'error');
      return;
    }

    const user = Storage.getUserByEmail(email.trim());

    // Email not found
    if (!user) {
      showToast('❌ Account not found. Create an account to continue.', 'error');
      // Show the signup panel if it exists on the same page
      if (typeof showSignup === 'function') {
        setTimeout(showSignup, 800);
      }
      return;
    }

    // Wrong password
    if (user.password !== password) {
      showToast('❌ Incorrect password. Please try again.', 'error');
      return;
    }

    // Success — set session and redirect
    Storage.setCurrentUser(user);
    showToast('✅ Login Successful', 'success');

    // Check if there's a redirect target saved
    var redirectTarget = sessionStorage.getItem('cj_redirect_after_login');
    sessionStorage.removeItem('cj_redirect_after_login');

    setTimeout(function () {
      window.location.href = redirectTarget || 'index.html';
    }, 900);
  }

  /* ── Logout ────────────────────────────────────── */
  function logout() {
    Storage.clearCurrentUser();
    showToast('👋 You have been logged out.', 'success');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 900);
  }

  /* ── Expose globally ───────────────────────────── */
  window.AUTH = {
    handleSignUp: handleSignUp,
    handleSignIn: handleSignIn,
    logout: logout
  };

  // Also expose logout standalone for main.js navbar
  window.logout = logout;

  /* ── Self-wire forms on DOMContentLoaded ────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignUp);
    }

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleSignIn);
    }
  });

})();
