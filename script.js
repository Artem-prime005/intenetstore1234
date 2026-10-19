document.addEventListener("DOMContentLoaded", () => {
    console.log("=== Кошик Nexus Technology активовано ===");

    // 1. Створюємо структуру кошика в єдиному стилі з CSS
    if (!document.getElementById("cartSidebar")) {
        const cartHTML = `
            <div class="cart-overlay" id="cartOverlay"></div>
            <div class="cart-sidebar" id="cartSidebar">
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
                    <button class="checkout-btn" id="checkoutBtn">Оформити замовлення</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    // 2. Ініціалізація змінних
    let cart = JSON.parse(localStorage.getItem("nexus_cart")) || [];
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItemsList = document.getElementById("cartItemsList");
    const cartTotalPriceElement = document.getElementById("cartTotalPrice");
    const cartBadge = document.querySelector(".cart-badge");

    // 3. Відкриття / Закриття через класи CSS (анімація плавного виїзду)
    const openCart = () => {
        cartSidebar.classList.add("open");
        cartOverlay.classList.add("active");
    };

    const closeCart = () => {
        cartSidebar.classList.remove("open");
        cartOverlay.classList.remove("active");
    };

    // Прив'язка кліку до кошика в шапці
    const cartTrigger = document.querySelector(".cart");
    if (cartTrigger) {
        cartTrigger.addEventListener("click", openCart);
    }

    document.getElementById("closeCartBtn").addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // 4. Оновлення інтерфейсу
    const updateCartUI = () => {
        if (cartBadge) {
            cartBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        cartItemsList.innerHTML = "";
        if (cart.length === 0) {
            cartItemsList.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:20px;">Кошик порожній</p>`;
            cartTotalPriceElement.textContent = "0 ₴";
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">${item.price.toLocaleString()} ₴ ${item.quantity > 1 ? 'x' + item.quantity : ''}</span>
                    </div>
                    <button class="remove-item-btn" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsList.insertAdjacentHTML("beforeend", itemHTML);
        });

        cartTotalPriceElement.textContent = `${total.toLocaleString()} ₴`;

        // Видалення елементів
        document.querySelectorAll(".remove-item-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                if (cart[idx].quantity > 1) cart[idx].quantity -= 1;
                else cart.splice(idx, 1);
                localStorage.setItem("nexus_cart", JSON.stringify(cart));
                updateCartUI();
            });
        });
    };

    // 5. Обробка натискання на кнопки "Купити" всередині карток товарів
    const buyButtons = document.querySelectorAll(".btn-buy");
    buyButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const card = e.target.closest(".product-card");
            if (!card) return;

            const name = card.querySelector(".product-name").textContent.trim();
            const priceText = card.querySelector(".product-price").textContent.trim();
            const price = parseInt(priceText.replace(/[^0-9]/g, ""));

            if (name && !isNaN(price)) {
                const existing = cart.find(item => item.name === name);
                if (existing) existing.quantity += 1;
                else cart.push({ name, price, quantity: 1 });

                localStorage.setItem("nexus_cart", JSON.stringify(cart));
                updateCartUI();
                openCart();
            }
        });
    });

    // Оформлення
    document.getElementById("checkoutBtn").addEventListener("click", () => {
        alert("Дякуємо! Ваше замовлення успішно оформлено.");
        cart = [];
        localStorage.removeItem("nexus_cart");
        updateCartUI();
        closeCart();
    });

    updateCartUI();
});