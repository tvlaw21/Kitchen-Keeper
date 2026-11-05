document.addEventListener('DOMContentLoaded', () => {
  // --- FAVORITE STAR TOGGLE ---
  const starFavs = document.querySelectorAll('.star-fav');
  starFavs.forEach(star => {
    star.addEventListener('click', () => {
      star.classList.toggle('active');
      star.classList.toggle('fas');
      star.classList.toggle('far');
    });
  });

  // --- SHOPPING LIST FUNCTIONALITY ---
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

        itemDiv.querySelector('.remove-btn').addEventListener('click', () => {
          itemDiv.remove();
        });
      }
    });
  }

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.shopping-item').remove();
    });
  });

  // --- PANTRY LISTENERS & PERSISTENCE ---
  loadPantryFromStorage();
  setupPantryListeners();

  const addPantryBtn = document.getElementById('add-pantry-btn');
  if (addPantryBtn) {
    addPantryBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('pantry-name');
      const qtyInput = document.getElementById('pantry-qty');
      const catSelect = document.getElementById('pantry-category');
      const locSelect = document.getElementById('pantry-location');
      const dateInput = document.getElementById('pantry-date');

      const name = nameInput ? nameInput.value.trim() : '';
      const qty = qtyInput ? qtyInput.value.trim() || '1' : '1';
      const category = catSelect ? catSelect.value : 'Produce';
      const location = locSelect ? locSelect.value : 'fridge';
      
      let formattedDate = '10/30/2026';
      if (dateInput && dateInput.value) {
        const parts = dateInput.value.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
        }
      }

      if (!name) {
        alert('Please enter a pantry item name.');
        return;
      }

      addPantryItemToDOM(name, qty, location, formattedDate, category);
      savePantryToStorage();
      checkExpirationUrgency();

      nameInput.value = '';
      if (qtyInput) qtyInput.value = '1';
      if (dateInput) dateInput.value = '';
    });
  }

  // --- CALENDAR & WEEK/MONTH SETUP ---
  initCalendar();
  checkExpirationUrgency();
  main();
});

// --- PANTRY HELPER FUNCTIONS ---
function setupPantryListeners() {
  document.querySelectorAll('.qty-control').forEach(control => {
    const minusBtn = control.querySelector('.btn-minus');
    const plusBtn = control.querySelector('.btn-plus');
    const valSpan = control.querySelector('.qty-val');

    if (minusBtn && plusBtn && valSpan) {
      minusBtn.onclick = () => {
        let current = parseInt(valSpan.textContent) || 1;
        if (current > 1) {
          valSpan.textContent = current - 1;
          savePantryToStorage();
        } else {
          // If quantity is 1 and "-" is clicked, remove the row completely
          const row = control.closest('tr');
          if (row) {
            row.remove();
            savePantryToStorage();
          }
        }
      };
      plusBtn.onclick = () => {
        let current = parseInt(valSpan.textContent) || 0;
        valSpan.textContent = current + 1;
        savePantryToStorage();
      };
    }
  });

  document.querySelectorAll('.location-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      if (btn.classList.contains('fridge')) {
        btn.classList.remove('fridge');
        btn.classList.add('pantry');
        btn.innerHTML = '<i class="fas fa-archive"></i> Pantry';
      } else {
        btn.classList.remove('pantry');
        btn.classList.add('fridge');
        btn.innerHTML = '<i class="fas fa-snowflake"></i> Fridge';
      }
      savePantryToStorage();
    };
  });
}

function addPantryItemToDOM(name, qty, location, expDate, category) {
  const sections = document.querySelectorAll('.category-section');
  let targetTbody = null;

  sections.forEach(sec => {
    if (sec.getAttribute('data-category') === category) {
      targetTbody = sec.querySelector('.pantry-tbody');
    }
  });

  if (!targetTbody) {
    targetTbody = document.querySelector('.pantry-tbody') || document.querySelector('.pantry-table tbody');
  }

  if (!targetTbody) return;

  const row = document.createElement('tr');
  const locClass = location === 'fridge' ? 'fridge' : 'pantry';
  const locIcon = location === 'fridge' ? 'snowflake' : 'archive';
  const locText = location === 'fridge' ? 'Fridge' : 'Pantry';

  row.innerHTML = `
    <td>${name}</td>
    <td>
      <div class="qty-control">
        <button class="btn-qty btn-minus">-</button>
        <span class="qty-val">${qty}</span>
        <button class="btn-qty btn-plus">+</button>
      </div>
    </td>
    <td>
      <button class="location-toggle-btn ${locClass}" title="Click to change location">
        <i class="fas fa-${locIcon}"></i> ${locText}
      </button>
    </td>
    <td>${expDate}</td>
  `;

  targetTbody.appendChild(row);
  setupPantryListeners();
}

function savePantryToStorage() {
  const pantryData = [];
  document.querySelectorAll('.category-section').forEach(sec => {
    const category = sec.getAttribute('data-category');
    sec.querySelectorAll('tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 4) {
        const name = cells[0].textContent.trim();
        const qty = cells[1].querySelector('.qty-val') ? cells[1].querySelector('.qty-val').textContent.trim() : '1';
        const locBtn = cells[2].querySelector('button');
        const location = locBtn && locBtn.classList.contains('fridge') ? 'fridge' : 'pantry';
        const expDate = cells[3].textContent.trim();
        pantryData.push({ name, qty, location, expDate, category });
      }
    });
  });
  localStorage.setItem('kitchenKeeperPantry', JSON.stringify(pantryData));
}

function loadPantryFromStorage() {
  const saved = localStorage.getItem('kitchenKeeperPantry');
  if (!saved) return;
  const pantryData = JSON.parse(saved);

  document.querySelectorAll('.pantry-tbody').forEach(tbody => tbody.innerHTML = '');

  pantryData.forEach(item => {
    addPantryItemToDOM(item.name, item.qty, item.location, item.expDate, item.category);
  });
}

function checkExpirationUrgency() {
  const rows = document.querySelectorAll('.pantry-table tbody tr');
  rows.forEach(row => {
    const dateCell = row.cells[3];
    if (dateCell) {
      const expDate = new Date(dateCell.textContent.trim());
      const today = new Date('10/15/2026');
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 4) {
        row.classList.add('expiring-soon');
        dateCell.title = "Expiring soon!";
      } else {
        row.classList.remove('expiring-soon');
      }
    }
  });
}

// --- CALENDAR & WEEK/MONTH NAVIGATION LOGIC ---
let currentMonth = 9; // October 2026
let currentYear = 2026;
let currentView = 'month';

function initCalendar() {
  const gridContainer = document.getElementById('calendar-grid-container');
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const btnWeek = document.getElementById('btn-week-view');
  const btnMonth = document.getElementById('btn-month-view');

  if (!gridContainer) return;

  renderCalendar();

  if (prevBtn) {
    prevBtn.onclick = () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    };
  }

  if (btnWeek && btnMonth) {
    btnWeek.onclick = () => {
      currentView = 'week';
      btnWeek.style.fontWeight = 'bold';
      btnMonth.style.fontWeight = 'normal';
      renderCalendar();
    };

    btnMonth.onclick = () => {
      currentView = 'month';
      btnMonth.style.fontWeight = 'bold';
      btnWeek.style.fontWeight = 'normal';
      renderCalendar();
    };
  }
}

function renderCalendar() {
  const gridContainer = document.getElementById('calendar-grid-container');
  const displaySpan = document.getElementById('month-year-display');
  if (!gridContainer || !displaySpan) return;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  displaySpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  const headersHTML = `
    <div class="day-name">Sun</div>
    <div class="day-name">Mon</div>
    <div class="day-name">Tue</div>
    <div class="day-name">Wed</div>
    <div class="day-name">Thu</div>
    <div class="day-name">Fri</div>
    <div class="day-name">Sat</div>
  `;

  const scheduledMeals = JSON.parse(localStorage.getItem('kitchenKeeperMeals') || '{}');
  const todayStr = '2026-10-15';

  if (currentView === 'month') {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    let cellsHTML = headersHTML;

    for (let i = 0; i < firstDayIndex; i++) {
      cellsHTML += `<div class="day-cell" style="opacity: 0.3; pointer-events: none;"><span></span></div>`;
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
      const hasMeal = scheduledMeals[dateKey];
      let dotHTML = hasMeal ? `<div class="meal-dot" title="${hasMeal}"></div>` : '';

      const isToday = (dateKey === todayStr) ? ' today' : '';

      cellsHTML += `
        <div class="day-cell${isToday}" data-date="${dateKey}">
          <span>${day}</span>
          ${dotHTML}
        </div>
      `;
    }
    gridContainer.innerHTML = cellsHTML;
  } else {
    let cellsHTML = headersHTML;
    for (let day = 11; day <= 17; day++) {
      const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
      const hasMeal = scheduledMeals[dateKey];
      let dotHTML = hasMeal ? `<div class="meal-dot" title="${hasMeal}"></div>` : '';
      const isToday = (dateKey === todayStr) ? ' today' : '';

      cellsHTML += `
        <div class="day-cell${isToday}" data-date="${dateKey}">
          <span>${day}</span>
          ${dotHTML}
        </div>
      `;
    }
    gridContainer.innerHTML = cellsHTML;
  }

  document.querySelectorAll('.day-cell[data-date]').forEach(cell => {
    cell.onclick = () => {
      openMealModal(cell.getAttribute('data-date'));
    };
  });
}

// Recipe ingredient mapping database for intelligent pantry checking
const recipeIngredientsMap = {
  "Blueberry Pancakes": ["milk", "flour", "sugar", "baking powder", "baking soda", "salt", "egg", "eggs", "butter", "blueberries"],
  "Salmon Fried Rice": ["oil", "onion", "ginger", "garlic", "sesame oil", "rice", "peas", "carrots", "butter", "eggs", "egg", "salt", "pepper", "salmon", "soy sauce", "rice vinegar", "green onions", "Sriracha"],
  "Cafe Latté": ["milk", "coffee"]
};

function openMealModal(dateStr) {
  const modal = document.getElementById('meal-modal');
  const title = document.getElementById('modal-date-title');
  const currentMealText = document.getElementById('modal-current-meal');
  if (!modal) return;

  if (title) title.textContent = `Schedule Meal (${dateStr})`;

  const scheduledMeals = JSON.parse(localStorage.getItem('kitchenKeeperMeals') || '{}');
  const existingMeal = scheduledMeals[dateStr];

  if (currentMealText) {
    if (existingMeal) {
      currentMealText.textContent = `Currently Scheduled: ${existingMeal}`;
    } else {
      currentMealText.textContent = `No recipe currently scheduled for this day.`;
    }
  }

  modal.showModal();

  const saveBtn = document.getElementById('save-meal-btn');
  const closeBtn = document.getElementById('close-meal-modal');
  const recipeSelect = document.getElementById('recipe-select');

  if (saveBtn) {
    saveBtn.onclick = () => {
      const recipe = recipeSelect ? recipeSelect.value : 'Custom Meal';
      scheduledMeals[dateStr] = recipe;
      localStorage.setItem('kitchenKeeperMeals', JSON.stringify(scheduledMeals));

      // Intelligent Pantry Check vs Recipe Ingredients
      const pantryItems = JSON.parse(localStorage.getItem('kitchenKeeperPantry') || '[]');
      const pantryNames = pantryItems.map(item => item.name.toLowerCase());
      
      const requiredIngredients = recipeIngredientsMap[recipe] || [recipe];
      const missingIngredients = requiredIngredients.filter(ing => {
        return !pantryNames.some(pName => pName.includes(ing.toLowerCase()));
      });

      let shoppingList = JSON.parse(localStorage.getItem('kitchenKeeperShoppingList') || '[]');
      let addedCount = 0;
      missingIngredients.forEach(ing => {
        const exists = shoppingList.some(s => (s.text || s.name || '').toLowerCase().includes(ing.toLowerCase()));
        if (!exists) {
          shoppingList.push({ text: `${ing} - 1 packs | Other`, checked: false });
          addedCount++;
        }
      });
      localStorage.setItem('kitchenKeeperShoppingList', JSON.stringify(shoppingList));

      showNotification(`Scheduled "${recipe}". Added ${addedCount} missing ingredient(s) to shopping list!`);
      modal.close();
      renderCalendar();
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => modal.close();
  }
}

function showNotification(msg) {
  const area = document.getElementById('notification-area');
  if (!area) return;
  area.innerHTML = `<div id="notification-banner">${msg}</div>`;
  setTimeout(() => {
    area.innerHTML = '';
  }, 4000);
}

// --- ALLERGY DIALOG & RECIPE FILTERING FUNCTIONS ---
async function main() {
  const allergyButton = document.getElementById("allergies");
  const close = document.getElementById("close");
  const allergyToggle = document.getElementById("turn-off");
  const filters = document.querySelectorAll(".food-filter");
  const allRecipes = document.querySelectorAll(".recipe");
  const allRatings = document.querySelectorAll(".ratings");
  const foodDialog = document.getElementById("food-dialog");

  if (allergyButton && foodDialog) {
    allergyButton.addEventListener("click", () => {
      allergyButton.classList.add("active");
      foodDialog.showModal();
    });
  }

  if (close && foodDialog) {
    close.addEventListener("click", () => {
      checkFilter(filters, allRecipes);
      foodDialog.close();
    });
  }

  if (allergyToggle && foodDialog) {
    allergyToggle.addEventListener("click", () => {
      allergyButton.classList.remove("active");
      allergyArray.length = 0;
      const list = document.getElementById("list");
      if (list) list.replaceChildren();
      foodDialog.close();
      checkFilter(filters, allRecipes);
    });
  }

  allRecipes.forEach(recipe => {
    const heart = recipe.querySelector(".heart");
    if (heart) {
      const fav = localStorage.getItem(recipe.id);
      heart.checked = (fav === heart.value);
      if (heart.checked) {
        recipe.classList.add("favorite");
      } else {
        recipe.classList.remove("favorite");
      }

      heart.addEventListener("change", () => {
        if (heart.checked) {
          recipe.classList.add("favorite");
          localStorage.setItem(recipe.id, heart.value);
        } else {
          recipe.classList.remove("favorite");
          localStorage.removeItem(recipe.id);
        }
        checkFilter(filters, allRecipes);
      });
    }
  });

  allRatings.forEach(rating => {
    const stars = rating.querySelectorAll(".star");
    const rated = localStorage.getItem(rating.id);

    stars.forEach(rate => {
      rate.checked = (rated === rate.value);
    });
    if (rated) {
      rating.classList.add("checked");
    } else {
      rating.classList.remove("checked");
    }
    stars.forEach(rate => {
      rate.addEventListener("change", () => {
        if (rate.checked) {
          stars.forEach(others => {
            if (others !== rate) others.checked = false;
          });
          rating.classList.add("checked");
          localStorage.setItem(rating.id, rate.value);
        } else {
          rating.classList.remove("checked");
          localStorage.removeItem(rating.id);
        }
      });
    });
  });

  filters.forEach(filter => {
    if (filter.value !== "allergies") {
      filter.addEventListener("click", () => {
        filter.classList.toggle("active");
        checkFilter(filters, allRecipes);
      });
    }
  });
}

const allergyArray = [];

function checkFilter(filters, allRecipes) {
  const searchBar = document.getElementById("searchBar");
  if (!searchBar) return;
  const searched = searchBar.value.toLowerCase().replace(/\s/g, "").trim();

  const arrayFilters = [];
  filters.forEach(filter => {
    if (filter.classList.contains("active")) {
      arrayFilters.push(filter.value);
    }
  });
  let found = false;
  const textDiv = document.getElementById("noResult");
  
  allRecipes.forEach(recipe => {
    let ingrd = recipe.dataset.ingredients ? recipe.dataset.ingredients.trim().toLowerCase().split(",") : [];
    let searchMatch = recipe.id.toLowerCase().includes(searched);
    let match = arrayFilters.every(filter => {
      if (filter === "allergies") {
        const allergyFound = allergyArray.some(allergy => ingrd.includes(allergy.trim().toLowerCase()));
        return !allergyFound;
      } else {
        return recipe.classList.contains(filter);
      }
    });

    if (match && searchMatch) {
      recipe.classList.remove("hidden");
      found = true;
    } else {
      recipe.classList.add("hidden");
    }
    if (textDiv) {
      textDiv.textContent = found ? "" : "Sorry: No Recipe Found";
    }
  });
}

function search() {
  const allRecipes = document.querySelectorAll(".recipe");
  const filters = document.querySelectorAll(".food-filter");
  checkFilter(filters, allRecipes);
}

function add() {
  const searchBar = document.getElementById("searchBar2");
  if (!searchBar) return;
  const searched = searchBar.value.trim().toLowerCase();
  const toDoDiv = document.createElement("div");
  toDoDiv.className = "toDo";
  
  const list = document.getElementById("list");

  if (searched !== "" && !allergyArray.includes(searched)) {
    allergyArray.push(searched);
    const allergyText = document.createElement("span");
    allergyText.textContent = searched;
    toDoDiv.appendChild(allergyText);

    const exit_button = document.createElement("button");
    exit_button.className = "exit_button";
    exit_button.textContent = "x";

    exit_button.addEventListener("click", () => {
      const i = allergyArray.indexOf(searched);
      if (i !== -1) {
        allergyArray.splice(i, 1);
      }
      toDoDiv.remove();
    });

    toDoDiv.appendChild(exit_button);
    if (list) list.appendChild(toDoDiv);

    const allRecipes = document.querySelectorAll(".recipe");
    const filters = document.querySelectorAll(".food-filter");
    checkFilter(filters, allRecipes);
  }

  searchBar.value = "";
}
