// Product Data (JSON)
const productsData = {
  "papelaria": [
    { "id": 1, "nome": "Banner", "preco": "A partir de R$ 80,00", "imagem": "img/produtos/banner.jpg", "estoque": 100, "variacoes": { "tamanhos": ["60x90", "80x120", "100x150", "120x200"] } },
    { "id": 2, "nome": "Foto Polaroid", "preco": "R$ 2,50", "imagem": "img/produtos/polaroid.jpg", "estoque": 100, "variacoes": { "tamanhos": ["6x7", "8x9"] } },
    { "id": 3, "nome": "Azulejo Personalizado", "preco": "R$ 30,00", "imagem": "img/produtos/azulejo.jpg", "estoque": 100, "variacoes": { "tamanhos": ["20x20", "21x30"] } },
    { "id": 4, "nome": "Azulejo 21x30", "preco": "R$ 35,00", "imagem": "img/produtos/azulejo-grande.jpg", "estoque": 100 },
    { "id": 5, "nome": "Cartão de Visita", "preco": "1000 un. por R$ 150,00", "imagem": "img/produtos/cartao.jpg", "estoque": 100 },
    { "id": 6, "nome": "Wind banner", "preco": "R$ 290,00", "imagem": "img/produtos/widerbanner.jpg", "estoque": 100 },
    { "id": 7, "nome": "Mini Calendário", "preco": "R$ 3,50", "imagem": "img/produtos/calendario.jpg", "estoque": 100 },
    { "id": 8, "nome": "Etiqueta Escolar", "preco": "R$ 29,90", "imagem": "img/produtos/etiqueta.jpg", "estoque": 100, "descricao": "35/40 unidades + 2 chaveiros" }
  ],
  "personalizados": [
    { "id": 9, "nome": "Caneca Personalizada", "preco": "R$ 39,90", "imagem": "img/produtos/caneca.jpg", "estoque": 100 },
    { "id": 10, "nome": "Álbum de Fotos + 18 Fotos", "preco": "R$ 89,00", "imagem": "img/produtos/album.jpg", "estoque": 100, "descricao": "Álbum com 30 folhas acompanhado de 18 fotos reveladas." },
    { "id": 11, "nome": "Caneca de Chopp", "preco": "R$ 4,50", "imagem": "img/produtos/chopp.jpg", "estoque": 100, "descricao": "Preço por unidade" },
    { "id": 12, "nome": "Chaveiro", "preco": "R$ 4,00", "imagem": "img/produtos/chaveiro.jpg", "estoque": 100 },
    { "id": 13, "nome": "Caixinha Personalizada", "preco": "R$ 25,00", "imagem": "img/produtos/caixinha.jpg", "estoque": 100 },
    { "id": 14, "nome": "Caixa Cone Pirâmide", "preco": "R$ 4,00", "imagem": "img/produtos/caixa-cone-piramide.jpg", "estoque": 100 },
    { "id": 15, "nome": "Topo de Bolo", "preco": "R$ 15,00", "imagem": "img/produtos/topo-bolo.jpg", "estoque": 100 },
    { "id": 16, "nome": "Quadro Personalizado", "preco": "R$ 29,90", "imagem": "img/produtos/quadro-personalizado.jpg", "estoque": 100 }
  ],
  "eventos": [
    { "id": 17, "nome": "Banner de 15 Anos", "preco": "R$ 150,00", "imagem": "img/produtos/15anos.jpg", "estoque": 100 },
    { "id": 18, "nome": "Buquê Borboleta c/ LED", "preco": "R$ 80,00", "imagem": "img/produtos/buque-led.jpg", "estoque": 2 },
    { "id": 19, "nome": "Buquê Borboleta s/ LED", "preco": "R$ 70,00", "imagem": "img/produtos/buque.jpg", "estoque": 100 }
  ]
};

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
const whatsappNumber = "5555999712009"; // REPLACE WITH YOUR NUMBER

// DOM Elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('product-modal');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('todos');
    updateCartCount();
    renderCart();
});

// Helper: Get all products in a flat array
function getAllProducts() {
    let all = [];
    for (let cat in productsData) {
        all = all.concat(productsData[cat]);
    }
    return all;
}

// Helper: Extract number from price string (rough estimation for total)
function getPriceValue(priceStr) {
    // Removes non-numeric chars except comma
    const match = priceStr.match(/(\d+,\d{2})/);
    if (match) {
        return parseFloat(match[0].replace(',', '.'));
    }
    const matchInt = priceStr.match(/(\d+)/);
    return matchInt ? parseFloat(matchInt[0]) : 0;
}

// Render Products
function renderProducts(category, searchTerm = '') {
    productGrid.innerHTML = '';
    
    let products = [];
    if (category === 'todos') {
        products = getAllProducts();
    } else {
        products = productsData[category];
    }

    if (searchTerm) {
        products = products.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openModal(product);
        
        // Use placeholder if image fails
        const imgPath = product.imagem;
        
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${imgPath}" alt="${product.nome}" onerror="this.src='https://via.placeholder.com/300?text=Sem+Imagem'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.nome}</h3>
                <p class="product-price">${product.preco}</p>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Filter Buttons
function filterProducts(category) {
    // Update Active Button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProducts(category);
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
    renderProducts('todos', e.target.value);
});

// Modal Logic
function openModal(product) {
    currentProduct = product;
    document.getElementById('modal-img').src = product.imagem;
    document.getElementById('modal-img').onerror = function() {this.src='https://via.placeholder.com/300?text=Sem+Imagem'};
    document.getElementById('modal-title').innerText = product.nome;
    document.getElementById('modal-price').innerText = product.preco;
    document.getElementById('modal-desc').innerText = product.descricao || "Produto personalizado de alta qualidade.";
    
    const variationsContainer = document.getElementById('modal-variations');
    variationsContainer.innerHTML = '';

    if (product.variacoes && product.variacoes.tamanhos) {
        const select = document.createElement('select');
        select.id = 'variation-select';
        product.variacoes.tamanhos.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.innerText = `Tamanho: ${size}`;
            select.appendChild(option);
        });
        variationsContainer.appendChild(select);
    }

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Cart Logic
function addToCartFromModal() {
    const variationSelect = document.getElementById('variation-select');
    const variation = variationSelect ? variationSelect.value : null;
    
    const cartItem = {
        ...currentProduct,
        cartId: Date.now(), // Unique ID for removal
        selectedVariation: variation
    };

    cart.push(cartItem);
    saveCart();
    closeModal();
    toggleCart(); // Open cart to show item added
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.length;
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    let total = 0;

    cart.forEach(item => {
        const numericPrice = getPriceValue(item.preco);
        total += numericPrice;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.imagem}" onerror="this.src='https://via.placeholder.com/100'">
            <div class="item-details">
                <h4>${item.nome}</h4>
                <p>${item.selectedVariation ? 'Tamanho: ' + item.selectedVariation : ''}</p>
                <p><strong>${item.preco}</strong></p>
                <span class="remove-btn" onclick="removeFromCart(${item.cartId})">Remover</span>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    document.getElementById('cart-total-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// WhatsApp Checkout
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    let totalEstimated = 0;

    cart.forEach(item => {
        message += `* ${item.nome}`;
        if (item.selectedVariation) message += ` (${item.selectedVariation})`;
        message += ` - ${item.preco}\n`;
        
        totalEstimated += getPriceValue(item.preco);
    });

    message += `\n*Total Estimado: R$ ${totalEstimated.toFixed(2).replace('.', ',')}*\n`;
    message += "\nAguardo confirmação!";

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}