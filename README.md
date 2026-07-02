# mutualFundDashboard-frontend

It is a mutual fund dashboard where the investor return is visible. Portfolio summary, analytics and portfolio wise holding is visible.

# 📊 Mutual Fund Portfolio Dashboard - Frontend

A modern, responsive Mutual Fund Portfolio Dashboard built with **React**, **TypeScript**, **Material UI**, and **Redux Toolkit**. The application helps investors visualize their mutual fund portfolio, track investment performance, analyze gains/losses, and monitor portfolio allocation through an intuitive dashboard.

> This project is the frontend application that communicates with the Mutual Fund Dashboard backend API.

---

## ✨ Features

- 📈 Portfolio Overview
- 💰 Investment Summary
- 📊 Current Portfolio Value
- 🥧 Asset Allocation Charts
- 📋 Investor Portfolio Details
- 🔍 Search & Filter Investors
- 📱 Fully Responsive UI
- 🌙 Light/Dark Theme Support
- ⚡ Fast Development using Nextjs
- 🔄 API Integration with Backend
- 📦 Modular Component Architecture

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Nextjs
- Material UI (MUI)
- Redux Toolkit

### Development

- ESLint
- npm

---

## 📁 Project Structure

```
src/
│
├── components/
│   ├── Charts/PortfolioAnalytics
|   ├── Header
│   ├── InvestorTable
│   ├── PortfolioSummary
│   └── SchemeHoldingsTable
│
├── context/ThemeContext
├── pages/
├── store/
│   ├── index.ts
│   └── investorSlice.ts
│
├── styles/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (24+ recommended)
- npm

---

### Clone Repository

```bash
git clone https://github.com/rajat3095/mutualFundDashboard-frontend.git

cd mutualFundDashboard-frontend
```

---

### Install Dependencies

```bash
npm install
```

---

### Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Adjust the API URL according to your backend server.

---

### Run Development Server

```bash
npm run dev
```

Application will start at

```
http://localhost:3000
```

---

## 🏗 Build for Production

```bash
npm run build
```

---

## 🔍 Preview Production Build

```bash
npm run preview
```

---

## 📦 Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| npm run dev     | Start development server     |
| npm run build   | Build production application |
| npm run preview | Preview production build     |
| npm run lint    | Run ESLint                   |

---

## 📸 Screenshots

### Dashboard

![alt text](image-1.png)

> Add dashboard screenshot here

```
docs/dashboard.png
```

### Portfolio Summary

![alt text](image.png)

> Add portfolio screenshot here

```
docs/portfolio-summary.png
```

### Investor Details

> Add investor details screenshot here

```
docs/investor-details.png
```

---

## 🔗 Backend Repository

Backend Repository:

https://github.com/rajat3095/mutualFundDashboard-backend

---

## 🎯 Future Improvements

- Authentication & Authorization
- Live NAV Integration
- Portfolio Comparison
- PDF Report Generation
- CSV/Excel Export
- Advanced Charts
- Notifications
- Mobile Optimization
- Unit Testing
- Docker Support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Rajat Gandhi**

GitHub: https://github.com/rajat3095

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
