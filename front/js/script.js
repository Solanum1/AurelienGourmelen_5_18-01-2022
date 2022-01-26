//Ciblage de l'id items
const itemsSection = document.getElementById("items");

//Définition de l'URL de l'API dans une variable
let url = "http://localhost:3000/api/products";

//Requête GET de l'API avec Fetch
fetch(url)
    //Promesse
    .then((response) =>
        response.json().then((data) => {
            for (let product of data) {
                const products = `<a href="./product.html?id=${product._id}">
                                    <article>
                                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                                        <h3 class="productName">${product.name}</h3>
                                        <p class="productDescription">${product.description}</p>
                                    </article>
                                    </a>`;
                //Insertion du HTML dans le DOM
                itemsSection.insertAdjacentHTML("beforeend", products);
            }
        })
    )
    // Si la promesse n'est pas résolue
    .catch((err) => console.log("Erreur : " + err));
