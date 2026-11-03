/* COMMON SHOPPING CART */

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

/* ADD PRODUCT TO CART */
function addToCart(button) {
    const item = button.closest(".item, .product");

    if (!item) {
        alert("Product not found!");
        return;
    }

    const name = item.querySelector("h3").innerText;
    const image = item.querySelector("img")?.getAttribute("src") || "";
    const priceText = item.querySelector(".price")?.innerText
        || item.innerText.match(/₹\s*[\d,]+(?:\.\d{1,2})?/ )?.[0];

    const price = Number((priceText || "").replace(/[₹,\s]/g, ""));

    if (!name || !Number.isFinite(price) || price <= 0) {
        alert("Please check the product name and price.");
        return;
    }

    const cart = getCart();
    const existing = cart.find(p => p.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            image: image,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(name + " added to cart!");
}

/* SHOW CART COUNT */
function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.innerText = total;
    });
}

/* DISPLAY PRODUCTS ON cart.html */
function displayCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!container || !totalElement) return;

    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalElement.innerText = "₹0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const row = document.createElement("div");
        row.className = "cart-row";

        const name = document.createElement("h3");
        name.innerText = item.name;

        const price = document.createElement("p");
        price.innerText = "Price: ₹" + item.price;

        const quantity = document.createElement("p");
        quantity.innerText = "Quantity: " + item.quantity;

        const minus = document.createElement("button");
        minus.innerText = "−";
        minus.onclick = () => changeQuantity(index, -1);

        const plus = document.createElement("button");
        plus.innerText = "+";
        plus.onclick = () => changeQuantity(index, 1);

        const remove = document.createElement("button");
        remove.innerText = "Remove";
        remove.onclick = () => removeFromCart(index);

        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            img.width = 100;
            row.appendChild(img);
        }

        row.append(name, price, quantity, minus, plus, remove);
        container.appendChild(row);
    });

    totalElement.innerText = "₹" + total.toFixed(2);
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

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    displayCart();
});