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

async function updateUser({
  name,
  email,
  username,
  phone,
  country,
  state_town,
}) {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/auth/update-user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({
      name,
      email,
      username,
      phone,
      country,
      state_town,
    }),
  });
  const data = await res.json();

  return {
    status: res.status,
    data,
  };
}

async function addCategory(name) {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/category/add-category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({
      name,
    }),
  });
  const data = await res.json();
  return {
    status: res.status,
    data,
  };
}

async function getCategories() {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/category/get-categories`, {
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

async function editCategory(id, name) {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/category/edit-category/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  return {
    status: res.status,
    data,
  };
}

async function deleteCategory(id) {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/category/delete-category/${id}`, {
    method: 'DELETE',
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

async function addProduct(formData) {
  const token = localStorage.getItem('stockOverFlow');

  const res = await fetch(`${API_BASE}/product/add-product`, {
    method: 'POST',
    headers: {
      token: token,
    },
    body: formData,
  });

  const data = await res.json();
  return {
    status: res.status,
    data,
  };
}

async function editProduct(id, data) {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/product/edit-product/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return {
    status: res.status,
    data: result,
  };
}

async function getProducts(filter = {}) {
  const token = localStorage.getItem('stockOverFlow');

  // Convert filter object to query string
  const params = new URLSearchParams();
  for (const key in filter) {
    if (filter[key]) params.append(key, filter[key]);
  }

  const res = await fetch(
    `${API_BASE}/product/get-products?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    }
  );
  const data = await res.json();

  return {
    status: res.status,
    data,
  };
}

async function deleteProduct(id) {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/product/delete-product/${id}`, {
    method: 'DELETE',
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

async function createOrder(payload) {
  const token = localStorage.getItem('stockOverFlow');
  const res = await fetch(`${API_BASE}/order/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return {
    status: res.status,
    data,
  };
}
