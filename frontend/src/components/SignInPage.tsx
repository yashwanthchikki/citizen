import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SignInPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important to receive cookie
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        let errorMessage = "Sign in failed";
        try {
          const errData = await res.json();
          if (errData?.message) errorMessage = errData.message;
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await res.json(); // { message: "Login successful" }

      toast({
        title: "Welcome back!",
        description: data.message || "You've successfully signed in.",
      });

      navigate("/app"); // redirect to main app
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paperboy-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-paperboy-white mb-2">PAPERBOY</h1>
          <p className="text-paperboy-white/70">Sign in to continue</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-paperboy-white">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-paperboy-black border-input-border text-paperboy-white placeholder:text-paperboy-white/50"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-paperboy-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-paperboy-black border-input-border text-paperboy-white placeholder:text-paperboy-white/50"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="paperboy" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <Button
            type="button"
            variant="paperboy-link"
            className="w-full"
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Sign up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
