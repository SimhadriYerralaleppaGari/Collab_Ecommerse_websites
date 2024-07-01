const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryList = document.getElementById('categoryList');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const productListTitle = document.getElementById('productListTitle');

let cart = [];
let products = [
    {
        id: '1',
        name: 'Smartphone X',
        description: 'Latest model with advanced features',
        price: 799.99,
        imageUrl: 'https://th.bing.com/th/id/OIP.L_IBmQ5JmWqU-k1Ezm9DjgHaFj?rs=1&pid=ImgDetMain',
        category: 'Electronics',
        stock: 10
    },
    {
        id: '2',
        name: 'Classic T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        imageUrl: 'https://cdn.pixabay.com/photo/2017/05/28/18/38/t-shirt-2351761_960_720.jpg',
        category: 'Clothing',
        stock: 50
    },
    {
        id: '3',
        name: 'Headphones',
        description: 'High-quality sound with noise cancellation',
        price: 149.99,
        imageUrl: 'https://th.bing.com/th/id/OSK.HEROjUkPHHLeQ6ogdahPmJ1ZRbGbltsp4xxnfquuZ7W8Pq0?rs=1&pid=ImgDetMain',
        category: 'Electronics',
        stock: 15
    },
    {
        id: '4',
        name: 'Running Shoes',
        description: 'Lightweight and comfortable for long runs',
        price: 89.99,
        imageUrl: 'https://th.bing.com/th/id/OIP.TqRgd0FAlCJEdKQrIgyqtAHaE8?rs=1&pid=ImgDetMain',
        category: 'Footwear',
        stock: 25
    }
];

let categories = [...new Set(products.map(product => product.category))];

function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('col-md-4', 'mb-4');
        productElement.innerHTML = `
            <div class="card product-card">
                <img src="${product.imageUrl}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><small class="text-muted">Category: ${product.category}</small></p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">$${product.price.toFixed(2)}</span>
                        <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                    <p class="stock-status ${getStockStatusClass(product.stock)}">
                        ${getStockStatus(product.stock)}
                    </p>
                </div>
                <button class="btn btn-link" onclick="viewProduct('${product.id}')">View Details</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

function getStockStatus(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Low Stock';
    return 'In Stock';
}

function getStockStatusClass(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock < 5) return 'low-stock';
    return 'in-stock';
}

function populateCategories() {
    categoryList.innerHTML = `
        <li><a class="dropdown-item" href="#" onclick="filterByCategory('all')">All Categories</a></li>
        ${categories.map(category => `
            <li><a class="dropdown-item" href="#" onclick="filterByCategory('${category}')">${category}</a></li>
        `).join('')}
    `;
}

function filterByCategory(category) {
    if (category === 'all') {
        displayProducts(products);
        productListTitle.textContent = 'All Products';
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
        productListTitle.textContent = `${category} Products`;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }
}

function updateCart() {
    cartItems.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
            <button class="btn btn-sm btn-danger float-end" onclick="removeFromCart('${item.id}')">Remove</button>
        `;
        cartItems.appendChild(li);
        subtotal += item.price * item.quantity;
    });
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    cartSubtotal.textContent = subtotal.toFixed(2);
    cartTax.textContent = tax.toFixed(2);
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        const modalTitle = document.getElementById('productModalLabel');
        const modalBody = document.getElementById('productModalBody');

        modalTitle.textContent = product.name;
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.imageUrl}" class="img-fluid" alt="${product.name}">
                </div>
                <div class="col-md-6">
                    <p>${product.description}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    <p class="stock-status ${getStockStatusClass(product.stock)}">
                        ${getStockStatus(product.stock)}
                    </p>
                    <button class="btn btn-primary" onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;

        modal.show();
    }
}

cartIcon.addEventListener('click', () => {
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    offcanvas.show();
});

checkoutBtn.addEventListener('click', () => {
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
});

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Order placed successfully! Thank you for your purchase.');
    cart = [];
    updateCart();
    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
    productListTitle.textContent = `Search Results for "${searchTerm}"`;
});

// Initialize the page
displayProducts(products);
populateCategories();
