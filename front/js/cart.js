//Lecture des données dans le localstorage

let objBasket = localStorage.getItem("obj");
let basket = JSON.parse(objBasket);
console.log(objBasket.productId);
