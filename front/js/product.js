//document.addEventListener("DOMContentLoaded", function () {
//Je récupère l'id du produit cliqué sur la page d'accueil
let getProductId = new URLSearchParams(document.location.search);
let productId = getProductId.get("id");

//Je rentre l'url avec id dans une variable
let urlProductId = `http://localhost:3000/api/products/${productId}`;

//Je fais une requête get de l'API
fetch(urlProductId)
    .then((response) =>
        response.json().then((data) => {
            //Je vérifie que j'ai bien accès aux données de l'api dans la console
            //console.log(data);
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
// Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans l’array.
const addProductsLocalStorage = (storage, product) => {
    for (let line of storage) {
        if (product.id == line.id && product.color == line.color) {
            line.quantity = +line.quantity + +product.quantity;
            localStorage.setItem("products", JSON.stringify(storage));
            return;
        }
    }
    storage.push(product);
    localStorage.setItem("products", JSON.stringify(storage));
};
//Sélection du bouton Ajouter au panier
const btnSend = document.getElementById("addToCart");

//Ecoute du click sur le bouton ajouter
btnSend.addEventListener("click", (event) => {
    event.preventDefault();

    let quantitySelected = document.getElementById("quantity").value;
    let colorSelected = document.getElementById("colors").value;

    if (colorSelected == false) {
        confirm("Veuillez sélectionner une couleur");
    } else if (quantitySelected == 0) {
        confirm("Veuillez sélectionner un nombre d'article");
    } else {
        //Récupération des valeurs du formulaire
        let basket = {
            id: productId,
            quantity: quantitySelected,
            color: colorSelected,
        };

        //Local Storage
        let productsInBasket = JSON.parse(localStorage.getItem("products"));

        //S'il n'y a pas de produit enregistré dans le local storage, j'ajoute le produit dans un tableau vide
        if (!productsInBasket) {
            productsInBasket = [];
        }
        addProductsLocalStorage(productsInBasket, basket);
        alert("Votre article a bien été ajouté au panier");
    }
});
