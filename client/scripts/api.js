const API_BASE = 'http://localhost:4000'; // Change port if needed

// --- Auth ---
async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

async function register(username, password) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

// --- Inventory ---
async function getInventory() {
  const res = await fetch(`${API_BASE}/api/inventory`);
  return res.json();
}

async function getItem(id) {
  const res = await fetch(`${API_BASE}/api/inventory/${id}`);
  return res.json();
}

async function addItem(itemData) {
  const res = await fetch(`${API_BASE}/api/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  return res.json();
}

async function editItem(id, itemData) {
  const res = await fetch(`${API_BASE}/api/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  return res.json();
}

async function deleteItem(id) {
  const res = await fetch(`${API_BASE}/api/inventory/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

// --- Users ---
async function getUsers() {
  const res = await fetch(`${API_BASE}/api/users`);
  return res.json();
}

async function addUser(userData) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
}

async function editUser(id, userData) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'DELETE'
  });
  return res.json();
} 