document.addEventListener("DOMContentLoaded", function () {
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
});

//---------------------------Ajout des produits dans le panier----------------------------------//

//Sélection de l'id du produit

//La ligne suivante s'exécute à chaque chargement - Ce n'est pas ce qu'on veut !!!
//localStorage.getItem("");

//Sélection de la quantité de produits

//Sélection de la couleur du produit
