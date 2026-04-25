document.addEventListener('DOMContentLoaded', () => {
    console.log("Website initialized.");

    // --- State Management ---
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let discount = parseFloat(localStorage.getItem('cart_discount')) || 0;

    // --- Utility Functions ---
    function saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateGlobalCounts();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('cart_discount', discount);
        updateGlobalCounts();
    }

    function updateGlobalCounts() {
        // Wishlist Count
        const wishlistHeaderCount = document.getElementById('wishlist-count');
        if (wishlistHeaderCount) {
            wishlistHeaderCount.innerText = `Wishlist (${wishlist.length})`;
        }
        
        const navWishlistBtn = document.querySelector('.nav-actions a[href="wishlist.html"]');
        if (navWishlistBtn) {
            let badge = navWishlistBtn.querySelector('.nav-badge');
            if (wishlist.length > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'nav-badge';
                    navWishlistBtn.appendChild(badge);
                }
                badge.innerText = wishlist.length;
            } else if (badge) {
                badge.remove();
            }
        }

        // Cart Count
        const navCartBtn = document.querySelector('.nav-actions a[href="cart.html"]');
        if (navCartBtn) {
            let badge = navCartBtn.querySelector('.cart-badge');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    navCartBtn.appendChild(badge);
                }
                badge.innerText = totalItems;
            } else if (badge) {
                badge.remove();
            }
        }
    }

    // --- Wishlist Logic ---
    const wishlistContainer = document.getElementById('wishlist-items-container');
    if (wishlistContainer) {
        function renderWishlist() {
            wishlistContainer.innerHTML = '';
            if (wishlist.length === 0) {
                wishlistContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; margin-top: 20px;">Your wishlist is empty.</p>';
                return;
            }
            wishlist.forEach((item, index) => {
                const productHtml = `
                    <div class="product-card">
                        <div class="product-image">
                            ${item.discount ? `<span class="discount">${item.discount}</span>` : ''}
                            <img src="${item.image}" alt="${item.title}">
                            <div class="card-actions">
                                <button class="icon-action remove-wishlist-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                            <button class="add-to-cart-btn" data-title="${item.title}" data-price="${item.price}" data-image="${item.image}">Add To Cart</button>
                        </div>
                        <div class="product-info">
                            <h4 class="product-title">${item.title}</h4>
                            <div class="product-price">
                                <span class="current-price">${item.price}</span>
                                ${item.oldPrice ? `<span class="old-price">${item.oldPrice}</span>` : ''}
                            </div>
                        </div>
                    </div>`;
                wishlistContainer.insertAdjacentHTML('beforeend', productHtml);
            });
            
            wishlistContainer.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    wishlist.splice(parseInt(btn.dataset.index), 1);
                    saveWishlist();
                    renderWishlist();
                });
            });

            wishlistContainer.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    handleAddToCart(btn.dataset.title, btn.dataset.price, btn.dataset.image);
                });
            });

            const moveAllBtn = document.getElementById('move-all-to-bag');
            if (moveAllBtn) {
                moveAllBtn.addEventListener('click', () => {
                    wishlist.forEach(item => {
                        handleAddToCart(item.title, item.price, item.image);
                    });
                    wishlist = [];
                    saveWishlist();
                    renderWishlist();
                });
            }
        }
        renderWishlist();
    }

    // --- Cart Logic ---
    function handleAddToCart(title, price, image) {
        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ title, price, image, quantity: 1 });
        }
        saveCart();
        alert(`${title} added to cart!`);
    }

    const cartTableBody = document.getElementById('cart-table-body');
    if (cartTableBody) {
        function renderCart() {
            cartTableBody.innerHTML = '';
            let subtotal = 0;

            cart.forEach((item, index) => {
                const itemPrice = parseFloat(item.price.replace('$', ''));
                const itemSubtotal = itemPrice * item.quantity;
                subtotal += itemSubtotal;

                const row = `
                    <tr>
                        <td>
                            <div class="cart-product-info">
                                <button class="remove-item-btn" data-index="${index}" style="border:none; background:none; cursor:pointer; color:var(--primary-color); font-size:18px;"><i class="fa-solid fa-circle-xmark"></i></button>
                                <img src="${item.image}" alt="${item.title}">
                                <span>${item.title}</span>
                            </div>
                        </td>
                        <td>${item.price}</td>
                        <td>
                            <div class="quantity-control" style="display:flex; align-items:center; gap:10px; border:1px solid #ccc; padding:5px; border-radius:4px; width:fit-content;">
                                <button class="qty-btn" data-index="${index}" data-action="dec" style="border:none; background:none; cursor:pointer;">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" data-index="${index}" data-action="inc" style="border:none; background:none; cursor:pointer;">+</button>
                            </div>
                        </td>
                        <td>$${itemSubtotal.toFixed(0)}</td>
                    </tr>`;
                cartTableBody.insertAdjacentHTML('beforeend', row);
            });

            document.getElementById('cart-subtotal').innerText = `$${subtotal.toFixed(0)}`;
            const discountAmt = subtotal * discount;
            document.getElementById('cart-discount').innerText = `-$${discountAmt.toFixed(0)}`;
            document.getElementById('cart-total').innerText = `$${(subtotal - discountAmt).toFixed(0)}`;

            // Event Listeners for quantity and removal
            cartTableBody.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    if (btn.dataset.action === 'inc') {
                        cart[idx].quantity += 1;
                    } else if (btn.dataset.action === 'dec' && cart[idx].quantity > 1) {
                        cart[idx].quantity -= 1;
                    }
                    saveCart();
                    renderCart();
                });
            });

            cartTableBody.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    cart.splice(parseInt(btn.dataset.index), 1);
                    saveCart();
                    renderCart();
                });
            });
        }

        renderCart();

        document.getElementById('apply-coupon').addEventListener('click', () => {
            const code = document.getElementById('coupon-input').value.trim();
            if (code === 'SAVE10') {
                discount = 0.10;
                alert('Coupon applied! 10% discount added.');
                saveCart();
                renderCart();
            } else {
                alert('Invalid coupon code.');
            }
        });

        document.getElementById('proceed-to-checkout').addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Your cart is empty!');
            }
        });
    }

    // --- Checkout Logic ---
    const orderItemsContainer = document.getElementById('order-items-container');
    if (orderItemsContainer) {
        let subtotal = 0;
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('$', ''));
            const itemSubtotal = itemPrice * item.quantity;
            subtotal += itemSubtotal;

            const itemHtml = `
                <div class="order-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div class="order-item-info" style="display:flex; align-items:center; gap:15px;">
                        <img src="${item.image}" alt="${item.title}" style="width:50px; height:50px; object-fit:contain;">
                        <span>${item.title} (x${item.quantity})</span>
                    </div>
                    <span>$${itemSubtotal.toFixed(0)}</span>
                </div>`;
            orderItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        document.getElementById('order-subtotal').innerText = `$${subtotal.toFixed(0)}`;
        const discountAmt = subtotal * discount;
        if (discountAmt > 0) {
            document.getElementById('order-discount-row').style.display = 'flex';
            document.getElementById('order-discount').innerText = `-$${discountAmt.toFixed(0)}`;
        }
        document.getElementById('order-total').innerText = `$${(subtotal - discountAmt).toFixed(0)}`;

        document.getElementById('place-order-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('order-success-popup').style.display = 'flex';
        });

        document.getElementById('close-popup-btn').addEventListener('click', () => {
            cart = [];
            discount = 0;
            saveCart();
            window.location.href = 'index.html';
        });
    }

    // --- Global Listeners ---
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.product-card');
            const title = card.querySelector('.product-title').innerText;
            const price = card.querySelector('.current-price').innerText;
            const image = card.querySelector('.product-image img').src;
            handleAddToCart(title, price, image);
        });
    });

    // Wishlist toggle logic (for product cards)
    document.querySelectorAll('.card-actions .fa-heart').forEach(heartBtn => {
        const card = heartBtn.closest('.product-card');
        if (!card) return;
        const title = card.querySelector('.product-title').innerText;

        // Set initial state
        if (wishlist.some(item => item.title === title)) {
            heartBtn.classList.replace('fa-regular', 'fa-solid');
            heartBtn.style.color = 'var(--primary-color)';
        }

        heartBtn.closest('.icon-action').addEventListener('click', (e) => {
            e.preventDefault();
            const idx = wishlist.findIndex(item => item.title === title);
            if (idx > -1) {
                wishlist.splice(idx, 1);
                heartBtn.classList.replace('fa-solid', 'fa-regular');
                heartBtn.style.color = '';
            } else {
                const price = card.querySelector('.current-price').innerText;
                const oldPrice = card.querySelector('.old-price')?.innerText || null;
                const image = card.querySelector('.product-image img').src;
                const discountText = card.querySelector('.discount')?.innerText || null;
                wishlist.push({ title, price, oldPrice, image, discount: discountText });
                heartBtn.classList.replace('fa-regular', 'fa-solid');
                heartBtn.style.color = 'var(--primary-color)';
            }
            saveWishlist();
        });
    });

    // Wishlist toggle logic (for product details page)
    const detailWishlistBtn = document.querySelector('.wishlist-btn');
    if (detailWishlistBtn) {
        const heartIcon = detailWishlistBtn.querySelector('i');
        const title = document.querySelector('.product-info-details h2')?.innerText;
        
        if (title) {
            // Set initial state
            if (wishlist.some(item => item.title === title)) {
                heartIcon.classList.replace('fa-regular', 'fa-solid');
                heartIcon.style.color = 'var(--primary-color)';
            }

            detailWishlistBtn.addEventListener('click', () => {
                const idx = wishlist.findIndex(item => item.title === title);
                if (idx > -1) {
                    wishlist.splice(idx, 1);
                    heartIcon.classList.replace('fa-solid', 'fa-regular');
                    heartIcon.style.color = '';
                } else {
                    const price = document.querySelector('.price-text')?.innerText;
                    const image = document.querySelector('.main-image img')?.src;
                    wishlist.push({ title, price, image });
                    heartIcon.classList.replace('fa-regular', 'fa-solid');
                    heartIcon.style.color = 'var(--primary-color)';
                }
                saveWishlist();
            });
        }
    }

    // --- Other Shared Logic ---
    updateGlobalCounts();

    // Filtering logic (Home page)
    const categoryItems = document.querySelectorAll('.category-item');
    const bestSellingGrid = document.getElementById('best-selling-grid');
    if (categoryItems.length > 0 && bestSellingGrid) {
        const bestSellingProducts = bestSellingGrid.querySelectorAll('.product-card');
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                categoryItems.forEach(c => c.classList.remove('active'));
                item.classList.add('active');
                const filter = item.dataset.filter;
                bestSellingProducts.forEach(product => {
                    if (filter === 'all' || product.dataset.category === filter) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
        document.querySelector('.category-item.active')?.click();
    }

    // Countdown Timer
    const countdown = document.querySelector('.countdown');
    if (countdown) {
        let totalSeconds = (3 * 24 * 3600) + (23 * 3600) + (19 * 60) + 56;
        const timeBoxes = countdown.querySelectorAll('.time-box h4');
        setInterval(() => {
            if (totalSeconds <= 0) return;
            totalSeconds--;
            const d = Math.floor(totalSeconds / (24 * 3600));
            const h = Math.floor((totalSeconds % (24 * 3600)) / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            timeBoxes[0].innerText = d.toString().padStart(2, '0');
            timeBoxes[1].innerText = h.toString().padStart(2, '0');
            timeBoxes[2].innerText = m.toString().padStart(2, '0');
            timeBoxes[3].innerText = s.toString().padStart(2, '0');
        }, 1000);
    }
    
    // About Page Stats
    document.querySelectorAll('.stat-box').forEach(box => {
        box.addEventListener('click', () => {
            document.querySelectorAll('.stat-box').forEach(b => b.classList.remove('active'));
            box.classList.add('active');
        });
    });

    // --- Mobile Menu Logic ---
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
