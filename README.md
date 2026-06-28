# Creative Jewellery Store

A modern **frontend e-commerce jewellery website** built using **HTML, CSS, and JavaScript**. This project started as my **first-year web development project** and has been significantly upgraded with interactive features such as user authentication, shopping cart management, checkout, and PDF receipt generation using **LocalStorage**.

> **📌 Note:** This project showcases my learning journey from building a simple static website to implementing real-world frontend functionality without using a backend.

---

## Features

### Authentication

* User Registration (Sign Up)
* User Login (Sign In)
* LocalStorage-based authentication
* Session persistence after page refresh
* Logout functionality
* Form validation
* Duplicate account prevention
* User-specific shopping experience

### Shopping Features

* Browse jewellery collections
* Add products to cart
* Cart badge with live item count
* Dynamic "Add to Cart" → "✓ Added to Cart" button state
* Quantity management
* Remove items from cart
* User-specific cart using LocalStorage
* Shopping restricted for guest users

### Checkout

* Order summary
* Customer information
* Shipping details
* Order placement confirmation
* Automatic cart clearing after successful order

### PDF Receipt

* Downloadable PDF receipt after placing an order
* Includes:

  * Receipt Number
  * Order Date
  * Customer Information
  * Purchased Products
  * Total Amount

### User Interface

* Responsive design
* Modern typography
* Premium jewellery-inspired layout
* Smooth hover effects and animations
* Toast notifications
* Clean navigation
* Responsive forms

---

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* LocalStorage API
* jsPDF (PDF Receipt Generation)

---

## Project Structure

```text
Creative-jewellary-main/
│
├── index.html
├── product.html
├── about-us.html
├── contact-us.html
├── login.html
├── signup.html
├── addtocart.html
├── payment.html
│
├── css/
│   ├── global.css
│   ├── home.css
│   ├── product.css
│   ├── cart.css
│   ├── auth.css
│   ├── payment.css
│   ├── profile.css
│   └── toast.css
│
├── js/
│   ├── auth.js
│   ├── cart.js
│   ├── checkout.js
│   ├── receipt.js
│   ├── storage.js
│   ├── toast.js
│   └── main.js
│
├── images/
└── README.md
```

---



## User Flow

1. Create a new account.
2. Log in with your credentials.
3. Browse jewellery products.
4. Add items to the shopping cart.
5. Review your cart.
6. Proceed to checkout.
7. Place your order.
8. Download the PDF receipt.

---

## Key Functionalities

* Frontend authentication using LocalStorage
* Session persistence across page refreshes
* Protected shopping flow (login required)
* Dynamic cart management
* User-specific cart data
* Real-time UI updates
* Responsive navigation
* PDF receipt generation
* Modular JavaScript architecture

---

## What I Learned

Through this project, I gained hands-on experience with:

* Semantic HTML
* Responsive CSS
* JavaScript DOM Manipulation
* Event Handling
* Form Validation
* LocalStorage
* Authentication Logic
* Shopping Cart Implementation
* State Management
* PDF Generation with JavaScript
* Code Organization
* Frontend Project Architecture

---


## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---


