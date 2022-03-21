//Fonction qui récupère le numéro de commande et l'affiche sur la page
function displayOrderId() {
    let getOrderId = new URLSearchParams(document.location.search);
    let orderId = getOrderId.get("id");
    let orderIdTarget = document.getElementById("orderId");
    orderIdTarget.textContent = `${orderId}`;
}
displayOrderId();
