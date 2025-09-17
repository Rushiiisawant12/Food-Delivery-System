// Swiper Slider
var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#previous",
  },
});

// Select DOM elements
const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

// Toggle cart sidebar
cartIcon.addEventListener('click', () => {
  cartTab.classList.add('cart-tab-active');
});

closeBtn.addEventListener('click', () => {
  cartTab.classList.remove('cart-tab-active');
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

// Optional: close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
});

// Product and cart arrays
let productList = [];
let cartProduct = [];

// Update total quantity and price
const updateTotals = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll('.item').forEach(item => {
    const quantity = parseInt(item.querySelector('.quantity-value').textContent);
    const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', '')) / quantity;
    totalPrice += price * quantity;
    totalQuantity += quantity;
  });

  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

// Display products
const showcards = () => {
  productList.forEach(product => {
    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');

    orderCard.innerHTML = `
      <div class="card-image">
        <img src="${product.image}">
      </div>
      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <a href="#" class="btn card-btn">Add to cart</a>
    `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector('.card-btn');
    cardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(product);
    });
  });

  updateTotals();
};

// Add product to cart
const addToCart = (product) => {
  const existingProduct = cartProduct.find(item => item.id === product.id);
  if (existingProduct) {
    alert('Item already in your cart!');
    return;
  }

  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace('$', ''));

  const cartItem = document.createElement('div');
  cartItem.classList.add('item');

  cartItem.innerHTML = `
    <div class="item-image"><img src="${product.image}"></div>
    <div class="detail">
      <h4>${product.name}</h4>
      <h4 class="item-total">$${(price * quantity).toFixed(2)}</h4>
    </div>
    <div class="flex">
      <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
      <h4 class="quantity-value">${quantity}</h4>  
      <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>  
      <a href="#" class="remove-btn"><i class="fa-solid fa-trash"></i></a>
    </div>
  `;

  cartList.appendChild(cartItem);

  const plusBtn = cartItem.querySelector('.plus');
  const minusBtn = cartItem.querySelector('.minus');
  const removeBtn = cartItem.querySelector('.remove-btn');
  const quantityValue = cartItem.querySelector('.quantity-value');
  const itemTotal = cartItem.querySelector('.item-total');

  plusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updateTotals();
  });

  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    } else {
      cartItem.remove();
      cartProduct = cartProduct.filter(item => item.id !== product.id);
    }
    updateTotals();
  });

  removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartItem.remove();
    cartProduct = cartProduct.filter(item => item.id !== product.id);
    updateTotals();
  });

  updateTotals();
};

// Clear Cart Functionality
const clearCartButton = document.createElement('a');
clearCartButton.href = "#";
clearCartButton.classList.add('btn', 'clear-cart-btn');
clearCartButton.textContent = 'Clear Cart';
clearCartButton.style.marginTop = '1rem';
cartTab.appendChild(clearCartButton);

clearCartButton.addEventListener('click', (e) => {
  e.preventDefault();
  cartList.innerHTML = '';
  cartProduct = [];
  updateTotals();
});

// Initialize App
function initApp() {
  fetch("products.json")
    .then(response => response.json())
    .then(data => {
      productList = data;
      showcards();
    });
}

initApp();
