let bookList = [];
let basketList = [];
let selectedBookType = "ALL";

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  preventDuplicates: false,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
};

const toggleModal = () => {
  document.querySelector(".basket-modal").classList.toggle("active");
};

const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    const active = Math.round(starRate) >= i ? " active" : "";
    starRateHtml += `<i class="bi bi-star-fill${active}" aria-hidden="true"></i>`;
  }
  return starRateHtml;
};

const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book-list");
  const visibleBooks =
    selectedBookType === "ALL"
      ? bookList
      : bookList.filter((book) => book.type === selectedBookType);

  if (visibleBooks.length === 0) {
    bookListEl.innerHTML = '<p class="catalog-message">No books found in this category.</p>';
    return;
  }

  bookListEl.innerHTML = visibleBooks
    .map(
      (book) => `
        <article class="book-card">
          <div class="book-cover">
            <img src="${book.imgSource}" alt="Cover of ${book.name}" loading="lazy" />
          </div>
          <div class="book-detail">
            <span class="book-author">${book.author}</span>
            <h2 class="book-name">${book.name}</h2>
            <div class="book-star-rate" aria-label="Rated ${book.starRate} out of 5">
              ${createBookStars(book.starRate)}
              <span class="review-count">${book.reviewCount} reviews</span>
            </div>
            <p class="book-description">${book.description}</p>
            <div class="book-price-row">
              <span class="book-price">$${Number(book.price).toFixed(2)}</span>
              ${
                book.oldPrice
                  ? `<span class="old-price">$${Number(book.oldPrice).toFixed(2)}</span>`
                  : ""
              }
            </div>
            <button class="btn-purple" type="button" onclick="adBookToBasket(${book.id})">
              ADD BASKET
            </button>
          </div>
        </article>`
    )
    .join("");
};

const createBookTypesHtml = () => {
  const filterEl = document.querySelector(".filter");
  const filterTypes = ["ALL", ...new Set(bookList.map((book) => book.type))];
  filterEl.innerHTML = filterTypes
    .map(
      (type) => `
        <li class="${type === selectedBookType ? "active" : ""}">
          <button type="button" onclick="filterBooks('${type}')" ${
            type === selectedBookType ? 'aria-pressed="true"' : 'aria-pressed="false"'
          }>
            ${BOOK_TYPES[type] || type}
          </button>
        </li>`
    )
    .join("");
};

const filterBooks = (bookType) => {
  selectedBookType = bookType;
  createBookTypesHtml();
  createBookItemsHtml();
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket-list");
  const basketCountEl = document.querySelector(".basket-count");
  const totalPriceEl = document.querySelector(".total-price");
  basketCountEl.textContent =
    basketList.reduce((total, item) => total + item.quantity, 0) || "";

  let totalPrice = 0;
  basketListEl.innerHTML = basketList.length
    ? basketList
        .map((item) => {
          totalPrice += item.product.price * item.quantity;
          return `
            <li class="basket-item">
              <img src="${item.product.imgSource}" alt="" width="72" height="96" />
              <div class="basket-item-info">
                <h3 class="book-name">${item.product.name}</h3>
                <span class="book-price">$${Number(item.product.price).toFixed(2)}</span><br />
                <button class="book-remove" type="button" onclick="removeItemToBasket(${item.product.id})">Remove</button>
              </div>
              <div class="book-count">
                <button type="button" aria-label="Decrease quantity" onclick="decreaseItemToBasket(${item.product.id})">−</button>
                <span>${item.quantity}</span>
                <button type="button" aria-label="Increase quantity" onclick="increaseItemToBasket(${item.product.id})">+</button>
              </div>
            </li>`;
        })
        .join("")
    : '<li class="basket-item">Your basket is empty.</li>';
  totalPriceEl.textContent =
    totalPrice > 0 ? `Total: $${totalPrice.toFixed(2)}` : "";
};

const adBookToBasket = (bookId) => {
  const book = bookList.find((item) => item.id === bookId);
  if (!book) return;

  const basketItem = basketList.find((item) => item.product.id === bookId);
  if (basketItem) {
    if (basketItem.quantity >= book.stock) {
      toastr.error("Sorry, we don't have enough stock.");
      return;
    }
    basketItem.quantity += 1;
  } else {
    basketList.push({ quantity: 1, product: book });
  }

  listBasketItems();
  toastr.success("Book added to basket successfully.");
};

const removeItemToBasket = (bookId) => {
  basketList = basketList.filter((item) => item.product.id !== bookId);
  listBasketItems();
};

const decreaseItemToBasket = (bookId) => {
  const item = basketList.find((entry) => entry.product.id === bookId);
  if (!item) return;
  if (item.quantity > 1) item.quantity -= 1;
  else removeItemToBasket(bookId);
  listBasketItems();
};

const increaseItemToBasket = (bookId) => {
  const item = basketList.find((entry) => entry.product.id === bookId);
  if (!item) return;
  if (item.quantity >= item.product.stock) {
    toastr.error("Sorry, we don't have enough stock.");
    return;
  }
  item.quantity += 1;
  listBasketItems();
};

const loadBooks = async () => {
  const bookListEl = document.querySelector(".book-list");
  try {
    const response = await fetch(new URL("products.json", document.baseURI));
    if (!response.ok) {
      throw new Error(`Book catalog request failed (${response.status}).`);
    }
    bookList = await response.json();
    createBookTypesHtml();
    createBookItemsHtml();
  } catch (error) {
    console.error("Unable to load the book catalog.", error);
    bookListEl.innerHTML =
      '<p class="catalog-message catalog-error">The book catalog could not be loaded. Please refresh the page to try again.</p>';
  }
};

loadBooks();
listBasketItems();
