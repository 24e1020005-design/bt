// TIẾNG TRUNG CHINESE - HỆ THỐNG ĐĂNG NHẬP & QUẢN LÝ
// Dành cho: login.html, register.html, home.html, các trang khác
const CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  STORAGE_KEY_USERS: 'chinese_users',
  STORAGE_KEY_LOGIN: 'isLoggedIn',
  STORAGE_KEY_CURRENT_USER: 'currentUser',
  LOGIN_PAGE: 'login.html',
  HOME_PAGE: 'home.html'
};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function checkAuth() {
  const isLoggedIn = getFromStorage(CONFIG.STORAGE-K_LOGIN, false);
  const currentPage = window.location.pathname.split('/').pop();

  if (!isLoggedIn && currentPage !== CONFIG.LOGIN_PAGE && currentPage !== 'register.html') {
    window.location.href = CONFIG.LOGIN_PAGE;
    return false;
  }

  if (isLoggedIn && (currentPage === CONFIG.LOGIN_PAGE || currentPage === 'register.html')) {
    window.location.href = CONFIG.HOME_PAGE;
    return false;
  }

  return isLoggedIn;
}
function displayUserName() {
  const user = getFromStorage(CONFIG.STORAGE_KEY_CURRENT_USER);
  const welcomeElements = $all('#welcomeUser, .welcome-user');
  welcomeElements.forEach(el => {
    if (el) el.textContent = user ? user.fullName || user.email : 'Bạn';
  });
}
function logout() {
  localStorage.removeItem(CONFIG.STORAGE_KEY_LOGIN);
  localStorage.removeItem(CONFIG.STORAGE_KEY_CURRENT_USER);
  window.location.href = CONFIG.LOGIN_PAGE;
}
function handleRegister(e) {
  e.preventDefault();

  const fullName = $('#registerFullName').value.trim();
  const email = $('#registerEmail').value.trim();
  const password = $('#registerPassword').value;
  const confirmPassword = $('#registerConfirmPassword').value;

  if (!fullName || !email || !password || !confirmPassword) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Email không hợp lệ!');
    return;
  }
  if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
    alert(`Mật khẩu phải có ít nhất ${CONFIG.MIN_PASSWORD_LENGTH} ký tự!`);
    return;
  }

  if (password !== confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }

  const users = getFromStorage(CONFIG.STORAGE_KEY_USERS, []);

  if (users.some(u => u.email === email)) {
    alert('Email này đã được đăng ký!');
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    fullName,
    email,
    password, 
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveToStorage(CONFIG.STORAGE_KEY_USERS, users);

  alert('Đăng ký thành công! Vui lòng đăng nhập.');
  window.location.href = CONFIG.LOGIN_PAGE;
}
function handleLogin(e) {
  e.preventDefault();

  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;

  if (!email || !password) {
    alert('Vui lòng nhập email và mật khẩu!');
    return;
  }

  const users = getFromStorage(CONFIG.STORAGE_KEY_USERS, []);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert('Email hoặc mật khẩu không đúng!');
    return;
  }

  saveToStorage(CONFIG.STORAGE_KEY_LOGIN, true);
  saveToStorage(CONFIG.STORAGE_KEY_CURRENT_USER, {
    fullName: user.fullName,
    email: user.email
  });

  alert(`Chào mừng ${user.fullName}! Đăng nhập thành công.`);
  window.location.href = CONFIG.HOME_PAGE;
}
function initAuth() {
  const isLoggedIn = checkAuth();
  if (isLoggedIn) {
    displayUserName();

    const logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
          logout();
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();

  if (currentPage === 'register.html') {
    const registerForm = $('#registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
  }

  if (currentPage === CONFIG.LOGIN_PAGE) {
    const loginForm = $('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  }

  initAuth();
});