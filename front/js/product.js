//-------------------------------------------------------------------
//Affichage du produit dans le panier
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
//Gestion du panier
//-------------------------------------------------------------------

// Fonction qui incrémente le nombre de produits dans le panier si ce même produit est déjà présent.
const addProductsLocalStorage = (storage, product) => {
    for (let line of storage) {
        if (product.id == line.id && product.color == line.color) {
            //utilisation du + unaire pour transformer en nombre
            line.quantity = +line.quantity + +product.quantity;
            localStorage.setItem("basket", JSON.stringify(storage));
            return;
        }
    }
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
        confirm("Veuillez sélectionner une couleur");
    } else if (quantitySelected == 0) {
        confirm("Veuillez sélectionner un nombre d'article");
    } else if (quantitySelected < 0) {
        confirm("Veuillez sélectionner un nombre d'article supérieur à zéro");
    } else if (quantitySelected > 100) {
        confirm("Veuillez sélectionner un nombre d'article inférieur à 100");
    } else {
        //Récupération des valeurs du formulaire
        let basket = {
            id: productId,
            quantity: quantitySelected,
            color: colorSelected,
            price: priceDisplayed,
        };
        console.log(basket);

        //Local Storage
        let productsInBasket = JSON.parse(localStorage.getItem("basket"));

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
