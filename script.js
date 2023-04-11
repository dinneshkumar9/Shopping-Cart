const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

// we need an array to hold our state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  console.log("submitted");
  const name = e.currentTarget.item.value;
  console.log(name);
  const item = {
    name: name,
    id: Date.now(),
    complete: false,
  };
  items.push(item);
  console.log(`There are ${items.length} in your state`);
  //clear the form
  e.target.reset();
  // fire off a custom event that will tell anyone else who cares that the items have been updated!
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function displayItems() {
  console.log(items);
  const html = items
    .map(
      (item) =>
        `<li class = 'shopping-item'>
            <input value = ${item.id} type = 'checkbox'  ${
          item.complete && "checked"
        }>
            <span class = 'itemName'>${item.name}</span>
            <button aria-label = 'Remove ${item.name}'
            value = '${item.id}'
            >&times;</button>
            </li>`
    )
    .join("");
  list.innerHTML = html;
}

function mirrorToLocalStorage() {
  console.log("saved items to localStorage");
  localStorage.setItem("items", JSON.stringify(items));
}

function restoreFromLocalStorage() {
  console.info("restore");
  const lsItems = JSON.parse(localStorage.getItem("items"));
  // console.log(lsItems);
  if (lsItems.length) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}

function deleteItem(id) {
  //console.log('item removed');
  //update items array without this one
  items = items.filter((item) => item.id !== id);
  console.log(items);
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}
function markAsComplete(id) {
  items = items.map((item) => {
    if (item.id === id) {
      item.complete = !item.complete;
    }
    return item;
  });
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

shoppingForm.addEventListener("submit", handleSubmit);
list.addEventListener("itemsUpdated", displayItems);
list.addEventListener("itemsUpdated", mirrorToLocalStorage);
// Event Delegation: We listen or the click on the list <ul> but then delegate the click over to the button if that is what was clicked
list.addEventListener("click", function (e) {
  const id = parseInt(e.target.value);
  if (e.target.matches("button")) {
    deleteItem(parseInt(e.target.value));
  }
  if (e.target.matches("input[type=checkbox]")) {
    markAsComplete(parseInt(e.target.value));
  }
});

restoreFromLocalStorage();
