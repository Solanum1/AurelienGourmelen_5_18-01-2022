//Requête GET de la méthode Fetch
fetch("http://localhost:3000/api/products")
    //Promesse de récupération du résultat de la requête au format json
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    //Promesse de récupération et traitement des données
    .then((data) => {
        //Création d'une boucle for pour afficher tous les produits
        for (let product of data) {
            const products = `<a href="./product.html?id=${product._id}">
                                    <article>
                                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                                        <h3 class="productName">${product.name}</h3>
                                        <p class="productDescription">${product.description}</p>
                                    </article>
                                    </a>`;
            //Ciblage de l'id items
            let itemsSection = document.getElementById("items");
            //Insertion du HTML dans le DOM
            itemsSection.insertAdjacentHTML("beforeend", products);
        }
    })
    // Si la promesse n'est pas résolue
    .catch((err) => console.log("Erreur : " + err));
