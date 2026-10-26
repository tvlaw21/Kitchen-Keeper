
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-shop-btn");
  const nameInput = document.getElementById("shop-input");
  const quantityInput = document.getElementById("shop-quantity");
  const unitInput = document.getElementById("shop-unit");
  const categoryInput = document.getElementById("shop-category");
  const list = document.getElementById("shopping-list-container");

  document.querySelectorAll(".shopping-item .remove-btn").forEach(button => {
  button.addEventListener("click", () => {
    button.closest(".shopping-item").remove();
  });
});

  // Add an item with all its details
  addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const quantity = Number(quantityInput.value);
    const unit = unitInput.value;
    const category = categoryInput.value;

    if (!name || !Number.isInteger(quantity) || quantity < 1) {
      alert("Please enter an item name and a valid quantity.");
      return;
    }

    const item = document.createElement("div");
    item.className = "shopping-item";

    const left = document.createElement("div");
    left.className = "shopping-item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const label = document.createElement("span");
    label.textContent = `${name} - ${quantity} ${unit} | ${category}`;

    checkbox.addEventListener("change", () => {
      label.style.textDecoration =
        checkbox.checked ? "line-through" : "none";
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "×";

    removeBtn.addEventListener("click", () => {
      item.remove();
    });

    left.append(checkbox, label);
    item.append(left, removeBtn);
    list.appendChild(item);

    nameInput.value = "";
    quantityInput.value = "";
    nameInput.focus();
  });
});
