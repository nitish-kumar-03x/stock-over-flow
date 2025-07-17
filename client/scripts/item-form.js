document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const form = document.getElementById('item-form');
  if (id) {
    document.getElementById('form-title').textContent = 'Edit Item';
    const item = await getItem(id);
    form.name.value = item.name;
    form.quantity.value = item.quantity;
  }
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const itemData = {
      name: form.name.value,
      quantity: parseInt(form.quantity.value, 10)
    };
    if (id) {
      await editItem(id, itemData);
    } else {
      await addItem(itemData);
    }
    window.location.href = 'inventory.html';
  });
}); 