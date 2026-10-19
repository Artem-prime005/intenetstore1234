document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "nexus_cart";
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        if (!Array.isArray(cart)) cart = [];
    } catch {
        cart = [];
    }

    const headerCart = document.querySelector(".cart");

    if (!headerCart) return;

    document.body.insertAdjacentHTML("beforeend", `
        <div class="cart-overlay" id="cartOverlay"></div>

        <button class="cart-sticker" id="cartSticker">
            <span class="sticker-icon">🛒</span>
            <span class="sticker-badge" id="stickerBadge">0</span>
        </button>

        <aside class="cart-sidebar" id="cartSidebar">
            <div class="cart-sidebar-header">
                <h2>Ваш кошик</h2>
                <button class="close-cart-btn" id="closeCartBtn">&times;</button>
            </div>

            <div class="cart-items-list" id="cartItemsList"></div>

            <div class="cart-sidebar-footer">
                <div class="cart-total-box">
                    <span>Разом:</span>
                    <span class="cart-total-price" id="cartTotalPrice">0 ₴</span>
                </div>
                <button class="checkout-btn" id="checkoutBtn">
                    Оформити замовлення
                </button>
            </div>
        </aside>
    `);

    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");
    const itemsList = document.getElementById("cartItemsList");
    const totalPrice = document.getElementById("cartTotalPrice");
    const sticker = document.getElementById("cartSticker");
    const stickerBadge = document.getElementById("stickerBadge");

    const money = price => price.toLocaleString("uk-UA") + " ₴";

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function openCart() {
        overlay.classList.add("active");
        sidebar.classList.add("open");
    }

    function closeCart() {
        overlay.classList.remove("active");
        sidebar.classList.remove("open");
    }

    headerCart.addEventListener("click", openCart);
    sticker.addEventListener("click", openCart);

    document.getElementById("closeCartBtn")
        .addEventListener("click", closeCart);

    overlay.addEventListener("click", closeCart);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeCart();
    });

    function renderCart() {
        const count = cart.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        const badge = headerCart.querySelector(".cart-badge");
        if (badge) badge.textContent = count;

        stickerBadge.textContent = count;
        sticker.classList.toggle("visible", count > 0);

        if (cart.length === 0) {
            itemsList.innerHTML = `
                <div class="cart-empty">
                    <h3>Кошик порожній</h3>
                    <p>Додайте товари, натиснувши кнопку «Купити».</p>
                </div>
            `;
            totalPrice.textContent = money(0);
            return;
        }

        itemsList.innerHTML = "";

        cart.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "cart-item";

            const details = document.createElement("div");
            details.className = "cart-item-details";

            const name = document.createElement("span");
            name.className = "cart-item-name";
            name.textContent = item.name;

            const price = document.createElement("span");
            price.className = "cart-item-price";
            price.textContent = money(item.price * item.quantity);

            const quantity = document.createElement("div");
            quantity.className = "cart-quantity";

            quantity.innerHTML = `
                <button data-action="minus" data-index="${index}">−</button>
                <span>${item.quantity}</span>
                <button data-action="plus" data-index="${index}">+</button>
            `;

            const remove = document.createElement("button");
            remove.className = "remove-item-btn";
            remove.textContent = "×";
            remove.dataset.action = "remove";
            remove.dataset.index = index;

            details.append(name, price, quantity);
            card.append(details, remove);
            itemsList.appendChild(card);
        });

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        totalPrice.textContent = money(total);
    }

    document.querySelectorAll(".product-card").forEach(card => {
        const button = card.querySelector(".btn-buy");
        if (!button) return;

        button.addEventListener("click", () => {
            const name = card.querySelector(".product-name")
                ?.textContent.trim();

            const priceText = card.querySelector(".product-price")
                ?.textContent || "";

            const price = Number(priceText.replace(/[^\d]/g, ""));

            if (!name || !Number.isFinite(price) || price <= 0) return;

            const existing = cart.find(item => item.name === name);

            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            saveCart();
            renderCart();
            openCart();
        });
    });

    itemsList.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const index = Number(button.dataset.index);
        const item = cart[index];

        if (!item) return;

        switch (button.dataset.action) {
            case "plus":
                item.quantity++;
                break;

            case "minus":
                item.quantity--;
                if (item.quantity <= 0) cart.splice(index, 1);
                break;

            case "remove":
                cart.splice(index, 1);
                break;
        }

        saveCart();
        renderCart();
    });

    document.getElementById("checkoutBtn").addEventListener("click", () => {
        if (cart.length === 0) return;

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        alert(
            "Дякуємо за замовлення в NEXUS TECHNOLOGY!\n" +
            "Сума: " + money(total) + "\n" +
            "Це демонстраційне оформлення без справжньої оплати."
        );
    });

    renderCart();
});