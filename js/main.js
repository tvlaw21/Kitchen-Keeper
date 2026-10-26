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


async function main() {
    const dialogBox = document.getElementById("food-dialog");
    const open = document.getElementById("allergies");
    const close = document.getElementById("close");
    const filters = document.querySelectorAll(".food-filter");
    const allRecipes = document.querySelectorAll(".recipe");
    const allRatings = document.querySelectorAll(".ratings");

    open.addEventListener("click", ()=>{
        dialogBox.showModal();
    });
    close.addEventListener("click", ()=>{
        dialogBox.close();
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
    filter.addEventListener("click", () =>{
        filter.classList.toggle("active");
        checkFilter(filters, allRecipes);
    });
    });

}

function checkFilter(filters, allRecipes){
    const arrayFilters = [];
    filters.forEach(filter => {
        if(filter.classList.contains("active")){
            arrayFilters.push(filter.value);
        }
    });
    allRecipes.forEach(recipe => {

            let matches = true; 
    arrayFilters.forEach(filter => {
        if(!recipe.classList.contains(filter)){
            matches = false;
        }
    });
    if(matches){
        recipe.classList.remove("hidden");
    }else{
        recipe.classList.add("hidden");
    }
    });
}

// Sear Recipe
function search(){
    const searched = document.getElementById("searchBar");
    const resultDiv = document.createElement("resultDiv");
    const textDiv = document.getElementById("noResult");
    const allRecipes = document.querySelectorAll(".recipe");
    let found = false;
    textDiv.replaceChildren();
    if(search !== null){
    allRecipes.forEach(recipe => {
        if(searched.value === "" || recipe.id.toLowerCase().includes(searched.value.toLowerCase().replace(/\s/g, "").trim())){
            recipe.classList.remove("hidden");
            found = true;
        }else{
            recipe.classList.add("hidden");
        }
    });
    if(!found){
      allRecipes.forEach(recipe => {
          recipe.classList.add("hidden");
      });
      textDiv.textContent = "Sorry: No Recipe Found"
    }
  }
}

main();

