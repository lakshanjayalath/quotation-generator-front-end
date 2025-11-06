# Quotation Generator Front-End

Quotation Generator Front-End is a modern React application for managing clients, products, quotations, and related business activities. Built with [Vite](https://vitejs.dev/) for fast development and [Material UI](https://mui.com/) for a professional look, it provides a dashboard, forms, tables, and charts for efficient business operations.

## Features

- **Dashboard**: Overview of recent transactions, activities, payments, and sales chart.
- **Clients Management**: Add, edit, and view clients with detailed forms and tables.
- **Products Management**: Manage inventory items, add/edit products, and generate quotations.
- **Quotation Generation**: Create, view, and manage quotations with customizable forms and product lists.
- **Authentication Pages**: Includes login and registration forms.
- **Responsive UI**: Optimized for desktop and mobile devices.
- **Sidebar & TopBar**: Easy navigation with collapsible sidebar and contextual top bar.
- **Material UI Components**: Professional tables, forms, cards, and charts.

## Project Structure

```
quotation-generator-front-end/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── AccountManagement.jsx
│   │   ├── ClientPage.jsx
│   │   ├── CompanyDetails.jsx
│   │   ├── ItemPage.jsx
│   │   ├── NewClientForm.jsx
│   │   ├── NewItemForm.jsx
│   │   ├── NewQuotationForm.jsx
│   │   ├── Overview.jsx
│   │   ├── ProductSettings.jsx
│   │   ├── QuotationList.jsx
│   │   ├── RecentActivity.jsx
│   │   ├── RecentPayment.jsx
│   │   ├── RecentTransaction.jsx
│   │   ├── SettingSidebar.jsx
│   │   ├── SideBar.jsx
│   │   ├── TaskSettings.jsx
│   │   ├── TopBar.jsx
│   │   └── UserDetails.jsx
│   └── pages/
│       ├── Dashboard.jsx
│       ├── LandingPage.jsx
│       ├── LoginPage.jsx
│       ├── RegisterForm.jsx
│       └── Setting.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js

```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/quotation-generator-front-end.git
   cd quotation-generator-front-end
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:
```sh
npm run dev
# or
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

To build for production:
```sh
npm run build
# or
yarn build
```

### Lint

To run ESLint:
```sh
npm run lint
# or
yarn lint
```

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/)
- [Axios](https://axios-http.com/)


## License

This project is licensed under the MIT License.

---

For more details, see the source code in [src/](src).
