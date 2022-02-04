//Récupération des données du panier dans le localStorage

let basket = JSON.parse(localStorage.getItem("products"));

//---------------------Affichage des produits du panier----------------------------//
//Si le panier est vide
if (basket == null) {
    document
        .getElementById("cart__items")
        //L'indiquer avec un message
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
                displayProducts(data);
            })
            .catch((err) => {
                console.log("Erreur : " + err);
            });
        //Je rassemble les informations fournies par l'API et le localStorage
        function displayProducts(productInApi) {
            let productsItems = {
                id: product.id,
                name: productInApi.name,
                imageUrl: productInApi.imageUrl,
                altText: productInApi.altText,
                quantity: product.quantity,
                colors: product.color,
                price: productInApi.price,
            };
            //Je sélectionne l'id de la section où seront affichés les produits
            let cartItemsDisplay = document.getElementById("cart__items");
            //J'affiche le produit dans le DOM avec ses caractéritiques
            cartItemsDisplay.insertAdjacentHTML(
                "beforeend",
                `
                <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                    <div class="cart__item__img">
                        <img src="${productsItems.imageUrl}" alt="${productsItems.altText}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${productsItems.name}</h2>
                            <p>${product.color}</p>
                            <p>${productsItems.price} € </p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>
                `
            );
        }
    }
}
