function getCart() {
    try {
        return JSON.parse(localStorage.getItem("stationeryCart")) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("stationeryCart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(button) {
    // Find the product card
    const card = button.closest(".item, .product");

    if (!card) {
        alert("Product card not found. Check the product HTML.");
        return;
    }

    // Read product name and price
    const name = button.dataset.name ||
                 card.querySelector("h3, h2")?.textContent.trim();

    const priceText = button.dataset.price ||
                      card.querySelector(".price")?.textContent ||
                      card.querySelector(".product-price")?.textContent;

    const price = Number(String(priceText || "").replace(/[^\d.]/g, ""));

    if (!name || !priceText || !Number.isFinite(price)) {
        alert("Please check the product name and price.");
        return;
    }

    const cart = getCart();
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(name + " added to cart!");
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });
}

function displayCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!container || !totalElement) return;

    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty. Visit a product page to add items.</p>";
        totalElement.textContent = "₹0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement("div");
        row.className = "cart-item";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = "Price: ₹" + item.price;

        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + item.quantity;

        const subtotalText = document.createElement("p");
        subtotalText.textContent = "Subtotal: ₹" + subtotal;

        const decrease = document.createElement("button");
        decrease.textContent = "−";
        decrease.onclick = () => changeQuantity(index, -1);

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.onclick = () => changeQuantity(index, 1);

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.onclick = () => removeItem(index);

        row.append(name, price, quantity, subtotalText,
                   decrease, increase, remove);

        container.appendChild(row);
    });

    totalElement.textContent = "₹" + total;
}

function changeQuantity(index, change) {
    const cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    displayCart();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
}

function clearCart() {
    localStorage.removeItem("stationeryCart");
    updateCartCount();
    displayCart();
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
});