document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    document.getElementById('item-details-container').textContent = 'No item selected.';
    return;
  }
  const item = await getItem(id);
  document.getElementById('item-details-container').innerHTML = `
    <h2>${item.name}</h2>
    <p>Quantity: ${item.quantity}</p>
    <a href="item-form.html?id=${item._id}">Edit</a>
    <a href="inventory.html">Back to Inventory</a>
  `;
}); 