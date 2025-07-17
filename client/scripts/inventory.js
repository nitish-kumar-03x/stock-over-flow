document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }
  const tableBody = document.querySelector('#inventory-table tbody');
  const items = await getInventory();
  tableBody.innerHTML = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>
        <a href="item-details.html?id=${item._id}">View</a>
        <a href="item-form.html?id=${item._id}">Edit</a>
        <button onclick="deleteItemHandler('${item._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
});

async function deleteItemHandler(id) {
  if (confirm('Are you sure?')) {
    await deleteItem(id);
    location.reload();
  }
} 