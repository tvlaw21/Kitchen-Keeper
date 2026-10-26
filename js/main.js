document.addEventListener('DOMContentLoaded', () => {
  // Favorite star toggle
  const starFavs = document.querySelectorAll('.star-fav');
  starFavs.forEach(star => {
    star.addEventListener('click', () => {
      star.classList.toggle('active');
      star.classList.toggle('fas');
      star.classList.toggle('far');
    });
  });

  // Shopping List Add Functionality
  const addShopBtn = document.getElementById('add-shop-btn');
  const shopInput = document.getElementById('shop-input');
  const shoppingListContainer = document.getElementById('shopping-list-container');

  if (addShopBtn && shopInput) {
    addShopBtn.addEventListener('click', () => {
      const value = shopInput.value.trim();
      if (value) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shopping-item';
        itemDiv.innerHTML = `
          <div class="shopping-item-left">
            <input type="checkbox">
            <span>${value}</span>
          </div>
          <button class="remove-btn">&times;</button>
        `;
        shoppingListContainer.appendChild(itemDiv);
        shopInput.value = '';

        // Attach delete listener to new item
        itemDiv.querySelector('.remove-btn').addEventListener('click', () => {
          itemDiv.remove();
        });
      }
    });
  }

  // Remove existing shopping items
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.shopping-item').remove();
    });
  });
});