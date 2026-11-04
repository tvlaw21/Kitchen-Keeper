document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-shop-btn");
  const nameInput = document.getElementById("shop-input");
  const quantityInput = document.getElementById("shop-quantity");
  const unitInput = document.getElementById("shop-unit");
  const categoryInput = document.getElementById("shop-category");
  const list = document.getElementById("shopping-list-container");

  // Load any existing shopping items saved in localStorage on page load
  loadShoppingFromStorage();

  // Attach delete handlers to any pre-existing DOM items
  document.querySelectorAll(".shopping-item .remove-btn").forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".shopping-item").remove();
      saveShoppingToStorage();
    });
  });

  // Add an item with all its details
  if (addBtn && nameInput) {
    addBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      const quantity = quantityInput && quantityInput.value ? Number(quantityInput.value) : 1;
      const unit = unitInput ? unitInput.value : "pieces";
      const category = categoryInput ? categoryInput.value : "Other";

      if (!name || (quantityInput && quantityInput.value && (!Number.isInteger(quantity) || quantity < 1))) {
        alert("Please enter an item name and a valid quantity.");
        return;
      }

      addShoppingItemToDOM(name, quantity, unit, category, false);
      saveShoppingToStorage();

      nameInput.value = "";
      if (quantityInput) quantityInput.value = "";
      nameInput.focus();
    });
  }
});

function addShoppingItemToDOM(name, qty, unit, category, isChecked) {
  const list = document.getElementById("shopping-list-container");
  if (!list) return;

  const item = document.createElement("div");
  item.className = "shopping-item";

  const left = document.createElement("div");
  left.className = "shopping-item-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isChecked;

  const label = document.createElement("span");
  // Format text cleanly depending on whether qty/unit/category are present
  if (qty && unit && category) {
    label.textContent = `${name} - ${qty} ${unit} | ${category}`;
  } else {
    label.textContent = name;
  }

  if (isChecked) {
    label.style.textDecoration = "line-through";
  }

  checkbox.addEventListener("change", () => {
    label.style.textDecoration = checkbox.checked ? "line-through" : "none";
    saveShoppingToStorage();
  });

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "×";

  removeBtn.addEventListener("click", () => {
    item.remove();
    saveShoppingToStorage();
  });

  left.append(checkbox, label);
  item.append(left, removeBtn);
  list.appendChild(item);
}

function saveShoppingToStorage() {
  const items = [];
  document.querySelectorAll(".shopping-item").forEach(itemEl => {
    const span = itemEl.querySelector("span");
    const checkbox = itemEl.querySelector("input[type='checkbox']");
    if (span) {
      items.push({
        text: span.textContent,
        checked: checkbox ? checkbox.checked : false
      });
    }
  });
  localStorage.setItem('kitchenKeeperShoppingList', JSON.stringify(items));
}

function loadShoppingFromStorage() {
  // Check both storage keys to capture items synced from the calendar or manually added
  const saved = localStorage.getItem('kitchenKeeperShoppingList') || localStorage.getItem('kitchenKeeperShopping');
  if (!saved) return;
  
  const items = JSON.parse(saved);
  const list = document.getElementById("shopping-list-container");
  if (!list) return;

  // Clear initial static items so stored items populate cleanly
  list.innerHTML = "";

  items.forEach(item => {
    // Handle both string formats and object structures gracefully
    if (typeof item === 'string') {
      addShoppingItemToDOM(item, '', '', '', false);
    } else {
      const textVal = item.text || `${item.name} - ${item.qty} ${item.unit} | ${item.category}`;
      addShoppingItemToDOM(textVal, '', '', '', item.checked);
    }
  });
}
