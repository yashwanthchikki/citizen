import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paperboy-black">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-paperboy-white">404</h1>
        <p className="mb-4 text-xl text-paperboy-white/70">Oops! Page not found</p>
        <a href="/" className="text-paperboy-red underline hover:text-paperboy-red/80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
