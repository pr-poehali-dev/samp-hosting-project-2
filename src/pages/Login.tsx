import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await api.auth.login(email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        authStorage.setUser(result.user, result.token);
        toast.success('Вход выполнен!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await api.auth.register(email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        authStorage.setUser(result.user, result.token);
        toast.success('Регистрация успешна!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Zap" className="text-primary" size={48} />
            <span className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Lite Host
            </span>
          </div>
          <p className="text-muted-foreground">Лучший хостинг для игровых серверов</p>
        </div>

        <Card className="bg-card/80 backdrop-blur border-primary/30 glow-primary">
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>Войдите или зарегистрируйтесь</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="admin@admin.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary glow-primary"
                    disabled={loading}
                  >
                    {loading ? 'Вход...' : 'Войти'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary glow-primary"
                    disabled={loading}
                  >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Назад на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
