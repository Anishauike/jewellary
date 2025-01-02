document.getElementById('go-to-signup').addEventListener('click', () => {
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('signup-page').classList.remove('hidden');
});

document.getElementById('go-to-login').addEventListener('click', () => {
  document.getElementById('signup-page').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  localStorage.setItem('user', JSON.stringify({ name, email, password }));
  alert('Account created successfully!');
  document.getElementById('signup-page').classList.add('hidden');
  document.getElementById('home-page').classList.remove('hidden');
});

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.email !== email || user.password !== password) {
    alert('Invalid credentials or user not registered.');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('signup-page').classList.remove('hidden');
  } else {
    alert('Login successful!');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
  }
});
