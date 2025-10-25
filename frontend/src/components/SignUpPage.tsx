import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ username: formData.username, password: formData.password }),
});


      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Signup failed");
      }

      toast({
        title: "Account created!",
        description: "Please sign in with your new account.",
      });

      navigate('/signin');
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-paperboy-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-paperboy-white mb-2">PAPERBOY</h1>
          <p className="text-paperboy-white/70">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-paperboy-white">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
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
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="bg-paperboy-black border-input-border text-paperboy-white placeholder:text-paperboy-white/50"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-paperboy-white">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="bg-paperboy-black border-input-border text-paperboy-white placeholder:text-paperboy-white/50"
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="paperboy" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Button
            type="button"
            variant="paperboy-link"
            className="w-full"
            onClick={() => navigate('/signin')}
          >
            Already have an account? Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
