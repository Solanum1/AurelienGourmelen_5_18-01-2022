//Récupération des données du panier dans le localStorage
let basket = JSON.parse(localStorage.getItem("basket"));
console.log(basket);

//Création d'un tableau vide pour récupérer les id
let products = [];

//Création de la variable qui aura le numéro de commande
let orderId = "";

//-------------------------------------------------------------------
//Affichage des produits du panier
//-------------------------------------------------------------------

//Fonction qui affiche les produits du panier
const displayBasket = () => {
    //Si le panier est vide l'indiquer sur la page
    if (basket == null || basket == 0) {
        document
            .getElementById("cart__items")
            .insertAdjacentHTML(
                "beforeend",
                '<p class="cart__item">Votre panier est vide</p>'
            );
        //Sinon afficher les produits du localStorage
    } else {
        //Création d'une boucle pour récupérer et afficher chaque produit
        for (let [index, product] of basket.entries()) {
            //Appel de la méthode Fetch
            fetch("http://localhost:3000/api/products/" + product.id)
                //Promesse de récupération du résultat de la requête au format json
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                //Récupération et traitement des données
                .then((data) => {
                    //Je sélectionne l'id de la section où seront affichés les produits
                    let cartItemsDisplay =
                        document.getElementById("cart__items");
                    //Création des balises, classes et attributs
                    //Balise article
                    let article = document.createElement("article");
                    article.classList.add("cart__item");
                    article.setAttribute("data-id", product.id);
                    article.setAttribute("data-color", product.color);
                    cartItemsDisplay.append(article);
                    //Balise div pour l'image
                    let divImg = document.createElement("div");
                    divImg.classList.add("cart__item__img");
                    article.append(divImg);
                    //Balise image
                    let img = document.createElement("img");
                    img.setAttribute("src", data.imageUrl);
                    img.setAttribute("alt", data.altTxt);
                    divImg.append(img);
                    //Balise div pour les caractéristiques du produit
                    let divContent = document.createElement("div");
                    divContent.classList.add("cart__item__content");
                    article.append(divContent);
                    //Balise div pour les caractéristiques du produit et description
                    let divDescription = document.createElement("div");
                    divDescription.classList.add(
                        "cart__item__content__description"
                    );
                    divContent.append(divDescription);
                    //Balise h2 - Nom du produit
                    let h2 = document.createElement("h2");
                    h2.textContent = data.name;
                    divDescription.append(h2);
                    //Balise p - Affichage de la couleur
                    let pColor = document.createElement("p");
                    pColor.textContent = product.color;
                    divDescription.append(pColor);
                    //Balise p - Affichage du prix unitaire
                    let pPrice = document.createElement("p");
                    pPrice.textContent = product.price + " €";
                    divDescription.append(pPrice);
                    //Balise div content settings
                    let divSettings = document.createElement("div");
                    divSettings.classList.add("cart__item__content__settings");
                    divContent.append(divSettings);
                    //Balise div content settings quantity
                    let divSettingsQuantity = document.createElement("div");
                    divSettingsQuantity.classList.add(
                        "cart__item__content__settings__quantity"
                    );
                    divSettings.append(divSettingsQuantity);
                    //Balise p pour la quantité
                    let pQte = document.createElement("p");
                    pQte.textContent = "Qté : ";
                    divSettingsQuantity.append(pQte);
                    //Balise input indiquant la quantité de produits dans le panier
                    let input = document.createElement("input");
                    input.classList.add("itemQuantity");
                    input.setAttribute("type", "number");
                    input.setAttribute("name", "itemQuantity");
                    input.setAttribute("min", "1");
                    input.setAttribute("max", "100");
                    input.setAttribute("value", product.quantity);
                    input.setAttribute("data-index", index);
                    //Écoute du changement de la quantité d'un produit
                    input.addEventListener("change", (event) => {
                        event.preventDefault();
                        //Récupération de la valeur modifiée
                        let newQuantity = event.target.value;
                        //Attribution de la nouvelle quantité au panier
                        basket[
                            event.target.getAttribute("data-index")
                        ].quantity = newQuantity;
                        //Mise à jour du localStorage
                        localStorage.clear();
                        localStorage.setItem("basket", JSON.stringify(basket));
                        //Mise à jour du nombre d'articles dans le panier
                        totalQuantityOfProducts(
                            basket,
                            document.getElementById("totalQuantity")
                        );
                        //Mise à jour de la quantité
                        totalPrice(
                            basket,
                            document.getElementById("totalPrice")
                        );
                    });
                    divSettingsQuantity.append(input);
                    //Balise div content settings suppression
                    let divDelete = document.createElement("div");
                    divDelete.classList.add(
                        "cart__item__content__settings__delete"
                    );
                    divSettings.append(divDelete);
                    //Balise p pour suppression articles
                    let pDelete = document.createElement("p");
                    pDelete.classList.add("deleteItem");
                    pDelete.setAttribute("data-index", index);
                    pDelete.textContent = "Supprimer";
                    //Écoute du clic pour la suppression d'un produit
                    pDelete.addEventListener("click", (event) => {
                        event.preventDefault();
                        //Supression de l'article
                        article.remove();
                        //Retrait de l'article du panier
                        basket.splice(
                            event.target.getAttribute("data-index"),
                            1
                        );
                        //Mise à jour du localStorage
                        localStorage.clear();
                        localStorage.setItem("basket", JSON.stringify(basket));
                        //Suppression de l'affichage de tous les articles
                        cartItemsDisplay.innerHTML = "";
                        //Tableau des id des produits vidé
                        products = [];
                        //Rappel de la fonction de création des articles
                        displayBasket();
                        //Mise à jour du nombre d'articles dans le panier
                        totalQuantityOfProducts(
                            basket,
                            document.getElementById("totalQuantity")
                        );
                        //Mise à jour de la quantité
                        totalPrice(
                            basket,
                            document.getElementById("totalPrice")
                        );
                    });
                    divDelete.append(pDelete);
                })
                //Fonction catch appelée s'il y a une erreur lors de la requête
                .catch((err) => {
                    console.log(`Erreur : ${err}`);
                });
            //Récupération des id pour envoi au serveur à la commande
            products.push(product.id);
        }
    }
};

//Fonction qui calcule et affiche le nombre total d'articles du panier
const totalQuantityOfProducts = (panier, elem) => {
    //J'utilise map pour copier le tableau et agir sur le contenu
    let mapped = panier.map((element) => element.quantity);
    let totalQ = 0;
    for (let i = 0; i < mapped.length; i++) {
        totalQ += +mapped[i];
    }
    if (totalQ <= 1) {
        elem.textContent = totalQ + " article";
    } else {
        elem.textContent = totalQ + " articles";
    }
};
//Fonction qui calcule et affiche le prix total du panier
const totalPrice = (panier, elem) => {
    let mappedP = panier.map((element) => element.price);
    let mappedQ = panier.map((element) => element.quantity);
    let totalP = 0;
    for (let i = 0; i < mappedP.length; i++) {
        totalP += mappedP[i] * mappedQ[i];
    }
    elem.textContent = totalP;
};

//-------------------------------------------------------------------
//Validation du formulaire client
//-------------------------------------------------------------------

let form = document.querySelector(".cart__order__form");

//Écoute de la modification du prénom
form.firstName.addEventListener("change", function () {
    validFirstName(this);
});
//Écoute de la modification du nom
form.lastName.addEventListener("change", function () {
    validLastName(this);
});
//Écoute de la modification de l'adresse
form.address.addEventListener("change", function () {
    validAddress(this);
});
//Écoute de la modification de la ville
form.city.addEventListener("change", function () {
    validCity(this);
});
//Écoute de la modification de l'email
form.email.addEventListener("change", function () {
    validEmail(this);
});

//Fonction générale pour la validation des données du formulaire
const validData = function (input, pattern, flag, IdErrorMsg, message) {
    let RegEx = new RegExp(pattern, flag);
    let ErrorMsg = document.getElementById(IdErrorMsg);
    if (RegEx.test(input.value)) {
        ErrorMsg.textContent = "";
        return true;
    } else {
        ErrorMsg.textContent = message;
        return false;
    }
};

//Fonction de contrôle du prénom
const validFirstName = function (inputFirstName) {
    //recherche un intervalle de caractères de a à z, caractères accentués et tiret, insensible à la casse (marqueur i),
    return validData(
        inputFirstName,
        "^[a-z-éèêàïç]+$",
        "gi",
        "firstNameErrorMsg",
        "Merci d'utiliser des lettres uniquement"
    );
};

//Fonction de contrôle du nom
const validLastName = function (inputLastName) {
    return validData(
        inputLastName,
        "^[a-z-éèêàïç]+$",
        "gi",
        "lastNameErrorMsg",
        "Merci d'utiliser des lettres uniquement"
    );
};

//Fonction de contrôle de l'adresse
const validAddress = function (inputAddress) {
    return validData(
        inputAddress,
        "^[a-zéèêàïç0-9.,-_ ]{5,50}[ ]{0,2}$",
        "gi",
        "addressErrorMsg",
        "Merci de rentrer une adresse valide (5 caractères minimum, lettres et chiffres)"
    );
};

//Fonction de contrôle de la ville
const validCity = function (inputCity) {
    return validData(
        inputCity,
        "^[a-z-éèêàïç]+$",
        "gi",
        "cityErrorMsg",
        "Merci d'utiliser des lettres uniquement"
    );
};
//Fonction de contrôle de l'adresse email
const validEmail = function (inputEmail) {
    return validData(
        inputEmail,
        "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9._-]+[.][a-z]{2,8}$",
        "g",
        "emailErrorMsg",
        "Merci de renseigner une adresse email valide, par exemple : adresse@gmail.com"
    );
};

// Fonction de contrôle de l'ensemble des champs du formulaire de contact
function validForm() {
    if (
        validFirstName(form.firstName) &&
        validLastName(form.lastName) &&
        validAddress(form.address) &&
        validCity(form.city) &&
        validEmail(form.email)
    ) {
        return true;
    } else {
        alert("Le formulaire n'est pas correctement renseigné");
    }
}

//Fonction de contrôle du panier vide
function emptyBasket() {
    let response = confirm(
        "Votre panier est vide. \nRetour vers la page d'accueil ?"
    );
    if (response == true) {
        window.location.href = "index.html";
    }
}

//Fonction qui envoi les données contact et products au click sur le bouton commander

function sendToServer(order) {
    order.addEventListener("click", (event) => {
        event.preventDefault();
        if (validForm() && basket != null && basket != 0) {
            //Création d'un objet contact qui récupère les données saisies dans le formulaire
            let contact = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value,
            };
            console.log(contact);
            localStorage.clear();
            //Envoi du formulaire dans le localStorage
            localStorage.setItem("contact", JSON.stringify(contact));
            localStorage.setItem("products", JSON.stringify(products));
            //post des données
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contact, products }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((server) => {
                    console.log(server.orderId);
                    console.log(products);
                    window.location.href =
                        "confirmation.html?id=" + `${server.orderId}`;
                });
        } else if (basket == null || basket == 0) {
            emptyBasket();
        }
    });
}

//---------------------------------------------------------------------
//Appel des fonctions

displayBasket();
totalQuantityOfProducts(basket, document.getElementById("totalQuantity"));
totalPrice(basket, document.getElementById("totalPrice"));
sendToServer(document.getElementById("order"));
