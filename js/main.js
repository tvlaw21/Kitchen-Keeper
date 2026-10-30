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

document.addEventListener('DOMContentLoaded', () => {
  // Toggle Item Location (Fridge <-> Pantry)
  const locationButtons = document.querySelectorAll('.location-toggle-btn');
  
  locationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('fridge')) {
        // Switch to Pantry
        btn.classList.remove('fridge');
        btn.classList.add('pantry');
        btn.innerHTML = '<i class="fas fa-archive"></i> Pantry';
      } else {
        // Switch to Fridge
        btn.classList.remove('pantry');
        btn.classList.add('fridge');
        btn.innerHTML = '<i class="fas fa-snowflake"></i> Fridge';
      }
    });
  });
});

async function main() {
    const allergyButton = document.getElementById("allergies");
    const close = document.getElementById("close");
    const allergyToggle = document.getElementById("turn-off");
    const filters = document.querySelectorAll(".food-filter");
    const allRecipes = document.querySelectorAll(".recipe");
    const allRatings = document.querySelectorAll(".ratings");
    const foodDialog = document.getElementById("food-dialog");

    allergyButton.addEventListener("click", ()=>{
        allergyButton.classList.add("active");
        foodDialog.showModal();
    });
    close.addEventListener("click", ()=>{
        checkFilter(filters, allRecipes);
        foodDialog.close();
    });


    allergyToggle.addEventListener("click", ()=>{
      // allergyButton.classList.toggle("active");
        // if(!allergyButton.classList.contains("active")){
        //   allergyButton.classList.add("active");
        // foodDialog.showModal();
        // }else{
          allergyButton.classList.remove("active");
          allergyArray.length = 0;
          // toDoDiv.appendChild(exit_button);
          list.replaceChildren();
          foodDialog.close();

          checkFilter(filters, allRecipes);
        // }
    });


     allRecipes.forEach(recipe => {
            const heart = recipe.querySelector(".heart");
            const fav = localStorage.getItem(recipe.id);
            heart.checked = (fav === heart.value);
            if(heart.checked){
                recipe.classList.add("favorite");
            }else{
                recipe.classList.remove("favorite");
            }
            
            heart.addEventListener("change", () =>{
            if(heart.checked){
                recipe.classList.add("favorite");
                localStorage.setItem(recipe.id, heart.value);
            }else{
                recipe.classList.remove("favorite");
                localStorage.removeItem(recipe.id);
            }
              checkFilter(filters, allRecipes);
            });
        });

        allRatings.forEach(rating => {
            const stars = rating.querySelectorAll(".star");
            const rated = localStorage.getItem(rating.id);
            
            stars.forEach(rate =>{
                rate.checked = (rated === rate.value);
            });
            if(rated){
              rating.classList.add("checked");
            }else{
              rating.classList.remove("checked");
            }
            stars.forEach(rate =>{
                rate.addEventListener("change", () => {
                  if(rate.checked){
                    stars.forEach(others => {
                      if(others !== rate){
                        others.checked = false;
                      }
                    });
                    rating.classList.add("checked");
                    localStorage.setItem(rating.id, rate.value);
                  }else{
                    rating.classList.remove("checked");
                    localStorage.removeItem(rating.id);
                  }
        })
            });
        });

    filters.forEach(filter => {
      if(filter.value !== "allergies"){
    filter.addEventListener("click", () =>{
        filter.classList.toggle("active");
        checkFilter(filters, allRecipes);
    });
  }
    });

}


  const allergyArray = []

function checkFilter(filters, allRecipes){
  const searched = document.getElementById("searchBar").value.toLowerCase().replace(/\s/g, "").trim();

    const arrayFilters = [];
    filters.forEach(filter => {
        if(filter.classList.contains("active")){
            arrayFilters.push(filter.value);
        }
    });
   let found = false;
   const textDiv = document.getElementById("noResult");
    allRecipes.forEach(recipe => {
      let ingrd = recipe.dataset.ingredients.trim().toLowerCase().split(",");
      let searchMatch = recipe.id.toLowerCase().includes(searched);
      let matches = arrayFilters.every(filter => {
        if(filter === "allergies"){
          const allergyFound = allergyArray.some(allergy =>{
          return(ingrd.includes(allergy.trim().toLowerCase()));

        });
        return !allergyFound;
        }else {
          return recipe.classList.contains(filter);
        }
        
    });
    if(matches && searchMatch){
          recipe.classList.remove("hidden");
          found = true;
    }else{
      recipe.classList.add("hidden");
    }
     if(!found){
      textDiv.textContent = "Sorry: No Recipe Found";
    }else{
      textDiv.textContent = "";
    }
        });
}

// Search Recipe
function search(){
    const allRecipes = document.querySelectorAll(".recipe");
    const filters = document.querySelectorAll(".food-filter");

    checkFilter(filters, allRecipes);
}

const list = document.getElementById("list");

function add(){
    const searchBar = document.getElementById("searchBar2");
    const searched = searchBar.value.trim().toLowerCase();
    const toDoDiv = document.createElement("div");
    
    const allRecipes = document.querySelectorAll(".recipe");
    toDoDiv.className = "toDo";
    if(searched != "" && !allergyArray.includes(searched)){
    allergyArray.push(searched);
    const allergyText = document.createElement("span");
    allergyText.textContent = searched;
    toDoDiv.appendChild(allergyText);

    const exit_button = document.createElement("button");
    exit_button.className = "exit_button";
    exit_button.textContent = "x";


    exit_button.addEventListener("click", ()=>{
      const i = allergyArray.indexOf(searched);
      if(i !== -1){
        allergyArray.splice(i, 1);
      }
        toDoDiv.remove();


    });

    toDoDiv.appendChild(exit_button);
    list.appendChild(toDoDiv);

    const allRecipes = document.querySelectorAll(".recipe");
    const filters = document.querySelectorAll(".food-filter");

    checkFilter(filters, allRecipes);
    }

    searchBar.value = "";
}

// main();
document.addEventListener('DOMContentLoaded', main);

