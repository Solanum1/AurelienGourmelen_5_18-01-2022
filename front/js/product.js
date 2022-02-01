//document.addEventListener("DOMContentLoaded", function () {
//Je récupère l'id du produit cliqué sur la page d'accueil
let getProductId = new URLSearchParams(document.location.search);
let productId = getProductId.get("id");
console.log(productId);

//Je rentre l'url avec id dans une variable
let urlProductId = `http://localhost:3000/api/products/${productId}`;
console.log(urlProductId);

//Je fais une requête get de l'API
fetch(urlProductId)
    .then((response) =>
        response.json().then((data) => {
            //Je vérifie que j'ai bien accès aux données de l'api dans la console
            console.log(data);
            //Je récupère et affiche les éléments img, alt title price et description dans le HTML
            document.querySelector(
                ".item__img"
            ).innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
            document.querySelector("#title").textContent += data.name;
            document.querySelector("#price").textContent += data.price;
            document.querySelector("#description").textContent +=
                data.description;
            //Je récupère le tableau des couleurs que j'insère dans une constante
            const tabColors = data.colors;
            //Je sélectionne la balise select, d'identifiant colors
            let colorId = document.querySelector("#colors");
            //Je crée une boucle itérative et insertion dans le HTML
            for (let color of tabColors) {
                let option = document.createElement("option");
                option.innerHTML = `${color}`;
                option.value = `${color}`;
                colorId.appendChild(option);
            }
        })
    )
    // Affichage de l'erreur si la promesse n'est pas résolue
    .catch((err) => console.log("Erreur : " + err));
//});

//---------------------------Gestion du panier----------------------------------//

//Sélection de la quantité de produits
let quantity = document.getElementById("quantity");
let quantitySelected = 0;

quantity.addEventListener("change", (event) => {
    quantitySelected = event.target.value;
});

//Sélection de la couleur du produit
const colorOption = document.getElementById("colors");
let colorSelected = "";

colorOption.addEventListener("change", (event) => {
    colorSelected = event.target.value;
});

//Sélection du bouton Ajouter au panier
const btnSend = document.getElementById("addToCart");

//Ecoute du click sur le bouton ajouter
btnSend.addEventListener("click", (event) => {
    event.preventDefault();

    if (colorSelected == false) {
        confirm("Veuillez sélectionner une couleur");
    } else if (quantitySelected == 0) {
        confirm("Veuillez sélectionner un nombre d'article");
    } else {
        alert("Votre article a bien été ajouté au panier");
        //Récupération des valeurs du formulaire
        let basket = {
            id: productId,
            quantity: quantitySelected,
            color: colorSelected,
        };
        console.log(basket);
        //Local Storage
        let productsInBasket = JSON.parse(localStorage.getItem("products"));
        //Fonction ajouter un produit dans le local storage
        const addProductsLocalStorage = () => {
            productsInBasket.push(basket);
            localStorage.setItem("products", JSON.stringify(productsInBasket));
        };
        //S'il y a déjà un produit enregistré dans le local storage
        if (productsInBasket) {
            addProductsLocalStorage();
            console.log(productsInBasket);
        }
        //S'il n'y a pas de produit enregistré dans le local storage, j'ajoute le produit dans un tableau vide
        else {
            productsInBasket = [];
            addProductsLocalStorage();
        }
    }
});

//Il est nécessaire d’utiliser localStorage pour pouvoir accéder à cet array depuis la page Panier.

//Lorsqu’on ajoute un produit au panier, si celui-ci n'était pas déjà présent dans le panier, on ajoute un nouvel élément dans l’array.

// Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans l’array.

//if panier est vide
//ajouter valeur dans array
//Sinon incrémenter quantité dans array
