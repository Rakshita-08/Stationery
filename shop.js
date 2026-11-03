/* =========================================
   PEN & PAPER - COMMON WISHLIST
   ========================================= */

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];


/* =========================================
   SAVE WISHLIST
   ========================================= */

function saveWishlist() {

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}


/* =========================================
   ADD / REMOVE WISHLIST
   ========================================= */

function toggleWishlist(
    name,
    price,
    image,
    heart
) {

    let existing = wishlist.find(
        item => item.name === name
    );


    if (existing) {

        wishlist = wishlist.filter(
            item => item.name !== name
        );

        heart.innerHTML = "♡";

        heart.classList.remove("liked");

    } else {

        wishlist.push({

            name: name,

            price: price,

            image: image

        });

        heart.innerHTML = "♥";

        heart.classList.add("liked");

    }


    saveWishlist();

    updateWishlistCount();

}


/* =========================================
   CHECK WISHLIST
   ========================================= */

function isInWishlist(name) {

    return wishlist.some(
        item => item.name === name
    );

}


/* =========================================
   CREATE TOP WISHLIST ICON
   ========================================= */

function createTopWishlist() {

    /* Don't create twice */

    if (
        document.querySelector(
            ".top-wishlist"
        )
    ) {
        return;
    }


    let topLinks =
        document.querySelector(".top-links");


    if (!topLinks) {
        return;
    }


    let wishlistLink =
        document.createElement("a");


    wishlistLink.href =
        "wishlist.html";


    wishlistLink.className =
        "top-wishlist";


    wishlistLink.innerHTML = `

        <span class="wishlist-symbol">
            ♡
        </span>

        <span class="wishlist-count">
            ${wishlist.length}
        </span>

    `;


    topLinks.appendChild(wishlistLink);

}


/* =========================================
   UPDATE TOP WISHLIST NUMBER
   ========================================= */

function updateWishlistCount() {

    document
        .querySelectorAll(".wishlist-count")
        .forEach(element => {

            element.innerText =
                wishlist.length;

        });

}


/* =========================================
   ADD HEART TO EVERY PRODUCT
   ========================================= */

function setupWishlist() {

    let products =
        document.querySelectorAll(
            ".product, .item"
        );


    products.forEach(product => {

        let title =
            product.querySelector("h3");


        if (!title) {
            return;
        }


        let name =
            title.innerText.trim();


        let priceElement =
            product.querySelector(".price");


        if (!priceElement) {
            return;
        }


        let priceText =
            priceElement.innerText
                .replace("₹", "")
                .replace(/,/g, "")
                .trim();


        let price =
            parseFloat(priceText);


        if (isNaN(price)) {
            return;
        }


        let imageElement =
            product.querySelector("img");


        let image =
            imageElement
                ? imageElement.getAttribute("src")
                : "";


        /* Don't create duplicate heart */

        if (
            product.querySelector(
                ".product-heart"
            )
        ) {
            return;
        }


        let heart =
            document.createElement("button");


        heart.className =
            "product-heart";


        if (isInWishlist(name)) {

            heart.innerHTML = "♥";

            heart.classList.add("liked");

        } else {

            heart.innerHTML = "♡";

        }


        heart.onclick =
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                toggleWishlist(
                    name,
                    price,
                    image,
                    heart
                );

            };


        product.style.position =
            "relative";


        product.appendChild(heart);

    });

}


/* =========================================
   STYLE
   ========================================= */

function addWishlistStyle() {

    let style =
        document.createElement("style");


    style.innerHTML = `

        /* PRODUCT HEART */

        .product,
        .item {
            position: relative;
        }


        .product-heart {

            position: absolute;

            top: 10px;

            right: 10px;

            width: 42px;

            height: 42px;

            border: none;

            border-radius: 50%;

            background: white;

            color: #777;

            font-size: 28px;

            cursor: pointer;

            box-shadow:
                0 2px 8px rgba(
                    0,
                    0,
                    0,
                    0.18
                );

            z-index: 20;

        }


        .product-heart:hover {

            transform: scale(1.1);

        }


        .product-heart.liked {

            color: #e63950;

            background: #fff0f3;

        }


        /* TOP WISHLIST */

        .top-wishlist {

            position: relative;

            text-decoration: none;

            color: #102b5c;

            font-size: 28px;

            margin-left: 8px;

            cursor: pointer;

        }


        .wishlist-symbol {

            font-size: 30px;

        }


        .top-wishlist:hover {

            color: #e63950;

        }


        /* WISHLIST NUMBER */

        .wishlist-count {

            position: absolute;

            top: -9px;

            right: -10px;

            background: #e63950;

            color: white;

            border-radius: 50%;

            min-width: 18px;

            height: 18px;

            font-size: 11px;

            display: flex;

            align-items: center;

            justify-content: center;

            font-weight: bold;

        }

    `;


    document.head.appendChild(style);

}


/* =========================================
   START
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        addWishlistStyle();

        createTopWishlist();

        setupWishlist();

        updateWishlistCount();

    }
);