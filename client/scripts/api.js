const API_BASE = 'http://localhost:4000/api'; // Change port if needed

async function registerUser({
  name,
  email,
  username,
  phone,
  country,
  state_town,
  password,
  confirm_password,
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      username,
      phone,
      country,
      state_town,
      password,
      confirm_password,
    }),
  });
  const data = await res.json();

  return {
    status: res.status,
    data,
  };
}

async function loginUser({ unique, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      unique,
      password,
    }),
  });

  const data = await res.json();

  return {
    status: res.status,
    data,
  };
}

async function getUser() {
  const token = localStorage.getItem('stockOverFlow');  
  const res = await fetch(`${API_BASE}/auth/get-user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  });
  const data = await res.json();

  return {
    status: res.status,
    data,
  };
}
