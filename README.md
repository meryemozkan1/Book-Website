# BookShop

BookShop is a responsive online bookstore demo where readers can explore a curated book collection, browse categories, and manage a shopping basket.

## Live Demo

Visit the live site: [BookShop on GitHub Pages](https://meryemozkan1.github.io/Book-Website/)

## Features

- Browse a catalog of books with cover images, descriptions, ratings, and prices.
- Filter books by category.
- Add books to a basket, adjust quantities, and remove items.
- View the basket item count and order total.
- Navigate between the Books, Audiobooks, Gifts, and About sections.
- Responsive layout for desktop and mobile screens.

## Built With

- HTML5
- CSS3
- JavaScript
- Bootstrap
- jQuery
- Toastr

## Run Locally

BookShop loads its catalog from `products.json` using `fetch`. Open the project through a local web server rather than directly as a `file://` URL.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser.

## Project Structure

```text
.
├── assets/
│   ├── images/
│   ├── bootstrap/
│   ├── jquery/
│   └── toastr/
├── app.js
├── index.html
├── products.json
└── style.css
```

## Preview

![BookShop preview](Books.Web.gif)
