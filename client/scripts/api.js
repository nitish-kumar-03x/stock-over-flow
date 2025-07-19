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
