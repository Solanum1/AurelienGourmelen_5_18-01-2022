//-------------------------------------------------------------------
//Affichage du produit
//-------------------------------------------------------------------

let getProductId = new URLSearchParams(document.location.search);
let productId = getProductId.get("id");

//Je fais une requête get de l'API
fetch(`http://localhost:3000/api/products/${productId}`)
    //Promesse de récupération du résultat de la requête au format json
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    .then((data) => {
        //Je récupère et affiche les éléments img, alt title price et description dans le DOM
        document.querySelector(
            ".item__img"
        ).innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
        document.querySelector("#title").textContent += data.name;
        document.querySelector("#price").textContent += data.price;
        document.querySelector("#description").textContent += data.description;
        //Je récupère les couleurs de l'API
        const tabColors = data.colors;
        //Je sélectionne l'emplacement du DOM
        let colorId = document.querySelector("#colors");
        //Je crée une boucle itérative et je l'insère dans le DOM
        for (let color of tabColors) {
            let option = document.createElement("option");
            option.textContent = `${color}`;
            colorId.append(option);
        }
    })
    // Affichage de l'erreur si la promesse n'est pas résolue
    .catch((err) => console.log("Erreur : " + err));

//-------------------------------------------------------------------
//Gestion du panier - localStorage
//-------------------------------------------------------------------

// Fonction qui ajoute le nombre de produits dans le localStorage
const addProductsLocalStorage = (storage, product) => {
    for (let line of storage) {
        if (product.id == line.id && product.color == line.color) {
            //utilisation du + unaire pour transformer en nombre
            line.quantity = +line.quantity + +product.quantity;
            localStorage.setItem("basket", JSON.stringify(storage));
            return;
        }
    }
    //Ajoute les données dans le localStorage
    storage.push(product);
    localStorage.setItem("basket", JSON.stringify(storage));
};

//Sélection du bouton Ajouter au panier
const btnSend = document.getElementById("addToCart");

//Ecoute du click sur le bouton ajouter
btnSend.addEventListener("click", (event) => {
    event.preventDefault();

    let quantitySelected = document.getElementById("quantity").value;
    let colorSelected = document.getElementById("colors").value;
    let priceDisplayed = document.getElementById("price").innerText;

    if (colorSelected == false) {
        alert("Veuillez sélectionner une couleur");
    } else if (quantitySelected == 0) {
        alert("Veuillez sélectionner un nombre d'article");
    } else if (quantitySelected < 0) {
        alert("Veuillez sélectionner un nombre d'article supérieur à zéro");
    } else if (quantitySelected > 100) {
        alert("Veuillez sélectionner un nombre d'article inférieur à 100");
    } else {
        //Ajout des produits dans le panier
        let basket = {
            id: productId,
            quantity: quantitySelected,
            color: colorSelected,
            price: priceDisplayed,
        };
        console.log(basket);

        //Lecture des données récupérées dans le local Storage
        let productsInBasket = JSON.parse(localStorage.getItem("basket"));
        console.log(productsInBasket);

        //S'il n'y a pas de produit enregistré dans le local storage, j'ajoute le produit dans un tableau vide
        if (!productsInBasket) {
            productsInBasket = [];
        }
        addProductsLocalStorage(productsInBasket, basket);

        if (basket.quantity == "1") {
            alert("Votre article a bien été ajouté au panier");
        } else {
            alert("Vos articles ont bien été ajoutés au panier");
        }
    }
});
