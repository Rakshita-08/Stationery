/* =====================================
   PEN & PAPER - COMMON WISHLIST
   ===================================== */

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];


/* ---------- SAVE WISHLIST ---------- */

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
}


/* ---------- UPDATE TOP COUNT ---------- */

function updateWishlistCount() {

    let count = document.getElementById("wishlist-count");

    if (count) {
        count.innerText = wishlist.length;
    }
}


/* ---------- ADD / REMOVE PRODUCT ---------- */

function toggleWishlist(product, heart) {

    let index = wishlist.findIndex(
        item => item.name === product.name
    );

    if (index === -1) {

        wishlist.push(product);

        heart.innerHTML = "♥";
        heart.classList.add("liked");

    } else {

        wishlist.splice(index, 1);

        heart.innerHTML = "♡";
        heart.classList.remove("liked");
    }

    saveWishlist();

    showWishlist();
}


/* ---------- ADD HEART TO PRODUCTS ---------- */

function createProductHearts() {

    let products = document.querySelectorAll(".product, .item");

    products.forEach(function(product) {

        if (product.querySelector(".wishlist-heart")) {
            return;
        }

        let nameElement = product.querySelector("h3,h2");

        if (!nameElement) {
            return;
        }

        let name = nameElement.innerText.trim();

        let priceElement = product.querySelector(".price");

        let price = priceElement
            ? priceElement.innerText.trim()
            : "";

        let imageElement = product.querySelector("img");

        let image = imageElement
            ? imageElement.getAttribute("src")
            : "";

        let heart = document.createElement("button");

        heart.className = "wishlist-heart";
        heart.innerHTML = "♡";
        heart.title = "Add to Wishlist";

        let alreadyLiked = wishlist.some(
            item => item.name === name
        );

        if (alreadyLiked) {
            heart.innerHTML = "♥";
            heart.classList.add("liked");
        }

        heart.onclick = function(event) {

            event.preventDefault();
            event.stopPropagation();

            toggleWishlist(
                {
                    name: name,
                    price: price,
                    image: image
                },
                heart
            );
        };

        product.style.position = "relative";

        product.appendChild(heart);
    });
}


/* ---------- TOP WISHLIST BUTTON ---------- */

function createTopWishlist() {

    if (document.getElementById("top-wishlist")) {
        return;
    }

    let topWishlist = document.createElement("div");

    topWishlist.id = "top-wishlist";

    topWishlist.innerHTML = `
        <button id="wishlist-button">
            ♥
            <span id="wishlist-count">0</span>
        </button>

        <div id="wishlist-box">

            <div class="wishlist-header">
                ❤️ My Wishlist
                <button id="close-wishlist">×</button>
            </div>

            <div id="wishlist-items"></div>

        </div>
    `;

    document.body.appendChild(topWishlist);

    document
        .getElementById("wishlist-button")
        .onclick = function() {

            let box = document.getElementById("wishlist-box");

            if (box.style.display === "block") {
                box.style.display = "none";
            } else {
                showWishlist();
            }
        };

    document
        .getElementById("close-wishlist")
        .onclick = function() {

            document.getElementById(
                "wishlist-box"
            ).style.display = "none";
        };

    updateWishlistCount();
}


/* ---------- SHOW ALL WISHLIST PRODUCTS ---------- */

function showWishlist() {

    let box = document.getElementById("wishlist-box");

    let items = document.getElementById("wishlist-items");

    if (!box || !items) {
        return;
    }

    box.style.display = "block";

    if (wishlist.length === 0) {

        items.innerHTML = `
            <div class="empty-wishlist">
                ❤️
                <p>Your wishlist is empty.</p>
                <small>Click the heart on any product to save it.</small>
            </div>
        `;

        return;
    }

    items.innerHTML = "";

    wishlist.forEach(function(item, index) {

        let div = document.createElement("div");

        div.className = "wishlist-product";

        div.innerHTML = `

            <img src="${item.image}" 
                 onerror="this.style.display='none';">

            <div class="wishlist-info">

                <h4>${item.name}</h4>

                <p>${item.price}</p>

            </div>

            <button class="remove-wishlist"
                    onclick="removeWishlist(${index})">
                ×
            </button>
        `;

        items.appendChild(div);
    });
}


/* ---------- REMOVE PRODUCT ---------- */

function removeWishlist(index) {

    wishlist.splice(index, 1);

    saveWishlist();

    createProductHearts();

    showWishlist();
}


/* ---------- CSS ---------- */

function addWishlistCSS() {

    if (document.getElementById("wishlist-css")) {
        return;
    }

    let style = document.createElement("style");

    style.id = "wishlist-css";

    style.innerHTML = `

        /* PRODUCT HEART */

        .wishlist-heart {

            position: absolute;

            top: 10px;
            right: 10px;

            width: 38px;
            height: 38px;

            border: none;

            border-radius: 50%;

            background: white;

            color: #777;

            font-size: 25px;

            cursor: pointer;

            box-shadow: 0 2px 8px #ccc;

            z-index: 10;
        }


        .wishlist-heart:hover {

            transform: scale(1.1);

        }


        .wishlist-heart.liked {

            color: #e63950;

        }


        /* TOP WISHLIST */

        #top-wishlist {

            position: fixed;

            top: 20px;
            right: 25px;

            z-index: 9999;

        }


        #wishlist-button {

            position: relative;

            width: 48px;
            height: 48px;

            border: none;

            border-radius: 50%;

            background: white;

            color: #777;

            font-size: 27px;

            cursor: pointer;

            box-shadow: 0 3px 12px #bbb;

        }


        #wishlist-count {

            position: absolute;

            top: -5px;
            right: -5px;

            background: #e63950;

            color: white;

            width: 20px;
            height: 20px;

            border-radius: 50%;

            font-size: 11px;

            display: flex;

            align-items: center;

            justify-content: center;

        }


        /* WISHLIST BOX */

        #wishlist-box {

            display: none;

            position: absolute;

            top: 58px;

            right: 0;

            width: 360px;

            max-height: 500px;

            overflow-y: auto;

            background: white;

            border-radius: 15px;

            box-shadow: 0 5px 25px #aaa;

        }


        .wishlist-header {

            padding: 18px;

            background: #102f61;

            color: white;

            font-size: 19px;

            font-weight: bold;

            display: flex;

            justify-content: space-between;

            align-items: center;

        }


        #close-wishlist {

            background: none;

            border: none;

            color: white;

            font-size: 25px;

            cursor: pointer;

        }


        .wishlist-product {

            display: flex;

            align-items: center;

            gap: 12px;

            padding: 12px;

            border-bottom: 1px solid #eee;

        }


        .wishlist-product img {

            width: 65px;

            height: 65px;

            object-fit: cover;

            border-radius: 8px;

        }


        .wishlist-info {

            flex: 1;

        }


        .wishlist-info h4 {

            margin: 0 0 5px;

            color: #102b5c;

        }


        .wishlist-info p {

            margin: 0;

            color: #e63950;

            font-weight: bold;

        }


        .remove-wishlist {

            border: none;

            background: #ffe5e5;

            color: #e63950;

            width: 28px;

            height: 28px;

            border-radius: 50%;

            cursor: pointer;

            font-size: 18px;

        }


        .empty-wishlist {

            text-align: center;

            padding: 35px 15px;

            color: #777;

        }


        .empty-wishlist p {

            font-size: 18px;

            color: #333;

        }


        @media(max-width:600px) {

            #top-wishlist {

                right: 10px;

                top: 10px;

            }


            #wishlist-box {

                width: 300px;

                right: -5px;

            }

        }

    `;

    document.head.appendChild(style);
}


/* ---------- START ---------- */

document.addEventListener("DOMContentLoaded", function() {

    addWishlistCSS();

    createTopWishlist();

    createProductHearts();

});