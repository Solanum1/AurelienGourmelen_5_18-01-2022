//Récupération des données du panier dans le localStorage

let basket = JSON.parse(localStorage.getItem("products"));
console.log(basket);

const allData = [];
console.log(allData);

//-------------------------------------------------------------------
//Affichage des produits du panier
const displayBasket = () => {
    //Si le panier est vide
    if (basket == null) {
        document
            .getElementById("cart__items")
            //Je l'indique sur la page
            .insertAdjacentHTML(
                "beforeend",
                '<p class="cart__item">Votre panier est vide</p>'
            );
        //Sinon afficher les produits du localStorage
    } else {
        //Création d'une boucle pour récupérer et afficher chaque produit
        for (let product of basket) {
            //Je récupère les données de l'API
            let url = `http://localhost:3000/api/products/` + product.id;
            fetch(url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((data) => {
                    //J'affiche les infos des produits

                    let productInApi = data;
                    let productsItems = {
                        id: product.id,
                        name: productInApi.name,
                        imageUrl: productInApi.imageUrl,
                        altText: productInApi.altTxt,
                        quantity: product.quantity,
                        colors: product.color,
                        price: product.price,
                    };
                    allData.push(productsItems);

                    //Je sélectionne l'id de la section où seront affichés les produits
                    let cartItemsDisplay =
                        document.getElementById("cart__items");
                    //Création des balises et insersion des classes, attributs
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
                    //Balise img
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
                    //Balise h2 - nom du produit
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
                    //Balise p pour qté
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
                    pDelete.textContent = "Supprimer";
                    divDelete.append(pDelete);

                    updateQuantity();
                    deleteProduct();
                })
                .catch((err) => {
                    console.log("Erreur : " + err);
                });
        }
    }
};

//---------------------------------------------------------------------
//Fonction qui calcule et affiche le nombre total d'articles du panier
const totalQuantityOfProducts = (panier, elem) => {
    //J'utilise map pour copier le tableau et agir sur le contenu
    let mapped = panier.map((element) => element.quantity);
    let totalQ = 0;
    for (let i = 0; i < mapped.length; i++) {
        totalQ += +mapped[i];
    }
    elem.textContent = totalQ;
};
//---------------------------------------------------------------------
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
//---------------------------------------------------------------------
//Fonction qui modifie la quantité de produits dans le panier
const updateQuantity = () => {
    let targetItemQuantity = document.querySelectorAll(".itemQuantity");
    targetItemQuantity.forEach((itemQuantity, i) => {
        itemQuantity.addEventListener("change", (event) => {
            event.preventDefault();
            //Je récupère la valeur modifiée dans la variable newQuantity
            let newQuantity = event.target.value;
            console.log(newQuantity);
            //J'attribue la nouvelle quantité au panier
            basket[i].quantity = newQuantity;

            //Montrer à Antoine - double alerte
            //alert("La quantité de ce produit a bien été modifiée");

            localStorage.clear();
            localStorage.setItem("products", JSON.stringify(basket));
            document.location.href = "cart.html";
        });
    });
};
//---------------------------------------------------------------------
//Fonction de suppression des articles

const deleteProduct = () => {
    let deleteSelection = document.querySelectorAll(".deleteItem");
    deleteSelection.forEach((deletedQuantity, i) => {
        deletedQuantity.addEventListener("click", (event) => {
            event.preventDefault();
            //basket[i].quantity = "0";
            basket.splice([i], 1);
            localStorage.clear();
            localStorage.setItem("products", JSON.stringify(basket));
            document.location.href = "cart.html";
            //Problème - s'il s'agit du même produit mais avec une couleur différente alors cette fonction supprime tous les produits de même id de la page.

            //Si plusieurs produits différents supprime tout le panier ???
            // if (localStorage.getItem(basket[i]) == null) {
            //     alert(
            //         "Votre panier est vide, vous allez être redirigé vers la page d'accueil"
            //     );
            //     document.location.href = "index.html";
            // } else {
            //     alert("test");
            // }
        });
    });
};

//---------------------------------------------------------------------

displayBasket();
totalQuantityOfProducts(basket, document.getElementById("totalQuantity"));
totalPrice(basket, document.getElementById("totalPrice"));
updateQuantity();
deleteProduct();
