import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#b88e2f] to-[#d64545] text-white text-center px-6">
      <h1 className="text-7xl font-bold mb-4 drop-shadow-lg">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Oops! Page not found 😢</h2>
      <p className="text-lg text-white/90 mb-8 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-light transition"
      >
        🏠 Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
