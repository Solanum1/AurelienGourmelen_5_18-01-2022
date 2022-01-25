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
        //Je récupère et affiche l'image
        const productImg = `<img src="${data.imageUrl}">`;
        document.querySelector(".item__img").insertAdjacentHTML("beforeend", productImg);
        //Je récupère et affiche le titre
        const productTitle = `${data.name}`;
        document.querySelector("#title").insertAdjacentHTML("beforeend", productTitle);
        //Je récupère et affiche le prix
        const priceProduct = `${data.price}`;
        document.querySelector("#price").insertAdjacentHTML("beforeend", priceProduct);
        //Je récupère et affiche la description
        const descProduct = `${data.description}`;
        document.querySelector("#description").insertAdjacentHTML("beforeend", descProduct);
        //Je récupère le tableau des couleurs + vérif en console
        const tabColors = data.colors;
        console.log(tabColors);
        //Je crée une boucle pour récupérer toutes les couleurs puis je les affiche dans les options
        let AddColors = "";
        for (let i of tabColors) {
        AddColors += `<option value="${i}"> ${i} </option>`;
        }
        document.querySelector("#colors").insertAdjacentHTML("beforeend", AddColors);
    })
    )
    // Affichage de l'erreur si la promesse n'est pas résolue
    .catch((err) => console.log("Erreur : " + err));

