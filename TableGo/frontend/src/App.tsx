import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Users/LoginPage";
import RegisterPage from "./pages/Users/RegisterPage";
import NotFoundPage from "./pages/Users/NotFoundPage";
import ProfilePage from "./pages/Users/Profile";
import HomePage from "./pages/Users/HomePage";
import BookingPage from "./pages/Users/BookingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
