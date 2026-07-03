'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider, Card, Button, Input, Label } from '@flames/ui';
import { activeTheme } from '@/theme.config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@flameslongton.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.user.role !== 'admin' && data.user.role !== 'kitchen') {
        throw new Error('Staff access only');
      }
      localStorage.setItem('admin-token', data.accessToken);
      localStorage.setItem('admin-email', data.user.email);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <div className="flex min-h-screen items-center justify-center bg-hero-gradient p-4">
        <Card className="w-full max-w-md">
          <div className="mb-6 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient font-heading font-bold text-primary-foreground">
              {activeTheme.logo.shortText}
            </span>
            <h1 className="mt-4 font-heading text-2xl font-bold">Staff login</h1>
            <p className="text-sm text-muted-foreground">{activeTheme.name}</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Dev: admin@flameslongton.local / admin123
          </p>
        </Card>
      </div>
    </ThemeProvider>
  );
}
