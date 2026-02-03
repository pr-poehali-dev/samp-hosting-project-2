import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import { authStorage } from "@/lib/auth";
import { api, User } from "@/lib/api";

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(authStorage.getUser());
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authStorage.isAuthenticated() || !currentUser || !currentUser.is_admin) {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.admin.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);

    try {
      await api.admin.updateBalance(selectedUser.id, amount);
      toast.success('Баланс обновлён');
      loadUsers();
      setSelectedUser(null);
    } catch (error) {
      toast.error('Ошибка обновления баланса');
    }
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Zap" className="text-primary" size={32} />
              <span className="text-2xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Lite Host
              </span>
              <Badge className="bg-secondary ml-2">Админ</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                <Icon name="LayoutDashboard" className="mr-2" size={16} />
                Панель
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Выход
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Панель администратора</h1>
          <p className="text-muted-foreground">Управление пользователями и балансами</p>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="bg-card/50 border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {user.email}
                        {user.is_admin && (
                          <Badge variant="secondary">Админ</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>ID: {user.id}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {user.balance.toFixed(2)} ₽
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Icon name="Wallet" className="mr-1" size={14} />
                            Изменить баланс
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card">
                          <DialogHeader>
                            <DialogTitle>Изменить баланс</DialogTitle>
                            <DialogDescription>
                              {selectedUser?.email}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleUpdateBalance} className="space-y-4">
                            <div>
                              <Label htmlFor="amount">Сумма (положительная = пополнение, отрицательная = списание)</Label>
                              <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                placeholder="100.00"
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-primary to-secondary"
                            >
                              Применить
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
