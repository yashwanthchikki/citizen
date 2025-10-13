import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('paperboy_token');

      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!token) {
        // No token → go to signin
        navigate('/signin');
        return;
      }

      try {
        // Call backend to verify token
        const res = await fetch('/api/verifytoken', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // pass token in header
          },
        });

        if (!res.ok) throw new Error('Invalid token');

        const data = await res.json();
        console.log(data); // { message: "token valid" }

        // Token valid → go to main app
        navigate('/app');
      } catch (err) {
        console.error(err);
        // Invalid token → go to signin
        navigate('/signin');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-paperboy-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-paperboy-white mb-8 tracking-wider">
          PAPERBOY
        </h1>
        <div className="w-16 h-1 bg-paperboy-red mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
