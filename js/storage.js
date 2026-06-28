/* =====================================================
   CREATIVE JEWELLERY — storage.js
   Central LocalStorage API
   ===================================================== */

const KEYS = {
  USERS:    'cj_users',
  SESSION:  'cj_session',
  CART:     (email) => `cj_cart_${email}`,
  ORDERS:   (email) => `cj_orders_${email}`,
  WISHLIST: (email) => `cj_wishlist_${email}`,
};

/* ── Users ────────────────────────────────────────── */
function getUsers() {
  return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
}

function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

function getUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/* ── Session ──────────────────────────────────────── */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem(KEYS.SESSION)) || null;
}

function setCurrentUser(user) {
  // Only store non-sensitive fields in session
  localStorage.setItem(KEYS.SESSION, JSON.stringify({ name: user.name, email: user.email }));
}

function clearCurrentUser() {
  localStorage.removeItem(KEYS.SESSION);
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

/* ── Cart ─────────────────────────────────────────── */
function getCart(email) {
  if (!email) return [];
  return JSON.parse(localStorage.getItem(KEYS.CART(email))) || [];
}

function saveCart(email, cart) {
  if (!email) return;
  localStorage.setItem(KEYS.CART(email), JSON.stringify(cart));
}

function clearCart(email) {
  if (!email) return;
  localStorage.removeItem(KEYS.CART(email));
}

/* ── Orders ───────────────────────────────────────── */
function getOrders(email) {
  if (!email) return [];
  return JSON.parse(localStorage.getItem(KEYS.ORDERS(email))) || [];
}

function saveOrder(email, order) {
  if (!email) return;
  const orders = getOrders(email);
  orders.unshift(order); // newest first
  localStorage.setItem(KEYS.ORDERS(email), JSON.stringify(orders));
}

/* ── Wishlist ─────────────────────────────────────── */
function getWishlist(email) {
  if (!email) return [];
  return JSON.parse(localStorage.getItem(KEYS.WISHLIST(email))) || [];
}

function saveWishlist(email, wishlist) {
  if (!email) return;
  localStorage.setItem(KEYS.WISHLIST(email), JSON.stringify(wishlist));
}

/* ── Export ───────────────────────────────────────── */
window.Storage = {
  getUsers, saveUsers, getUserByEmail,
  getCurrentUser, setCurrentUser, clearCurrentUser, isLoggedIn,
  getCart, saveCart, clearCart,
  getOrders, saveOrder,
  getWishlist, saveWishlist,
};
