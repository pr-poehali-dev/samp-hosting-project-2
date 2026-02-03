import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import { authStorage } from "@/lib/auth";
import { api, Server, Bot } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authStorage.getUser());
  const [servers, setServers] = useState<Server[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authStorage.isAuthenticated() || !user) {
      navigate('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    try {
      const data = await api.servers.getAll(user.id);
      setServers(data.servers || []);
      setBots(data.bots || []);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate('/');
  };

  const handleCreateServer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const plan = formData.get('plan') as string;
    const mod = formData.get('mod') as string;

    try {
      await api.servers.createServer(user.id, name, type, plan, mod || undefined);
      toast.success('Сервер создан!');
      loadData();
    } catch (error) {
      toast.error('Ошибка создания сервера');
    }
  };

  const handleServerControl = async (serverId: number, command: string) => {
    try {
      await api.servers.controlServer(serverId, command);
      toast.success(`Сервер ${command === 'start' ? 'запущен' : 'остановлен'}`);
      loadData();
    } catch (error) {
      toast.error('Ошибка управления сервером');
    }
  };

  const handleCreateBot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('bot_name') as string;
    const token = formData.get('bot_token') as string;

    try {
      await api.servers.createBot(user.id, name, token);
      toast.success('Бот создан!');
      loadData();
    } catch (error) {
      toast.error('Ошибка создания бота');
    }
  };

  const handleBotControl = async (botId: number, command: string) => {
    try {
      await api.servers.controlBot(botId, command);
      toast.success(`Бот ${command === 'start' ? 'запущен' : 'остановлен'}`);
      loadData();
    } catch (error) {
      toast.error('Ошибка управления ботом');
    }
  };

  if (!user) return null;

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
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-primary/20 text-primary text-lg px-4 py-2">
                💰 {user.balance.toFixed(2)} ₽
              </Badge>
              <Button onClick={handleLogout} variant="outline">
                Выход
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Панель управления</h1>
          <p className="text-muted-foreground">Добро пожаловать, {user.email}</p>
        </div>

        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="servers">Серверы</TabsTrigger>
            <TabsTrigger value="bots">Боты</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Мои серверы SAMP/CRMP</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary glow-primary">
                    <Icon name="Plus" className="mr-2" size={20} />
                    Создать сервер
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Создать новый сервер</DialogTitle>
                    <DialogDescription>Заполните данные для создания сервера</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateServer} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название сервера</Label>
                      <Input id="name" name="name" placeholder="Мой сервер" required />
                    </div>
                    <div>
                      <Label htmlFor="type">Тип</Label>
                      <Select name="type" defaultValue="samp">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="samp">SAMP</SelectItem>
                          <SelectItem value="crmp">CRMP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="plan">Тариф</Label>
                      <Select name="plan" defaultValue="free">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="vip">VIP - 250₽</SelectItem>
                          <SelectItem value="super_vip">Super VIP - 440₽</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mod">Мод (опционально)</Label>
                      <Select name="mod">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите мод" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rodina_rp">Rodina RP</SelectItem>
                          <SelectItem value="radmir_rp">Radmir RP</SelectItem>
                          <SelectItem value="black_russia">Black Russia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                      Создать
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <p>Загрузка...</p>
            ) : servers.length === 0 ? (
              <Card className="bg-card/50">
                <CardContent className="py-12 text-center">
                  <Icon name="Server" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">У вас пока нет серверов</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {servers.map((server) => (
                  <Card key={server.id} className="bg-card/50 border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle>{server.name}</CardTitle>
                        <Badge variant={server.status === 'running' ? 'default' : 'secondary'}>
                          {server.status === 'running' ? '🟢 Работает' : '🔴 Остановлен'}
                        </Badge>
                      </div>
                      <CardDescription>
                        {server.type.toUpperCase()} • {server.plan}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Icon name="Network" size={16} />
                          <span>{server.ip_address}:{server.port}</span>
                        </div>
                      </div>
                      {server.mod && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Package" size={16} />
                          <span>{server.mod}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {server.status === 'running' ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleServerControl(server.id, 'stop')}>
                              <Icon name="Square" className="mr-1" size={14} />
                              Остановить
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleServerControl(server.id, 'restart')}>
                              <Icon name="RotateCw" className="mr-1" size={14} />
                              Перезапуск
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" className="bg-primary" onClick={() => handleServerControl(server.id, 'start')}>
                            <Icon name="Play" className="mr-1" size={14} />
                            Запустить
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bots" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Telegram боты</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary glow-primary">
                    <Icon name="Plus" className="mr-2" size={20} />
                    Создать бота
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Создать Telegram бота</DialogTitle>
                    <DialogDescription>Введите токен от @BotFather</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateBot} className="space-y-4">
                    <div>
                      <Label htmlFor="bot_name">Название бота</Label>
                      <Input id="bot_name" name="bot_name" placeholder="Мой бот" required />
                    </div>
                    <div>
                      <Label htmlFor="bot_token">Токен</Label>
                      <Input id="bot_token" name="bot_token" placeholder="123456:ABC-DEF..." required />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                      Создать
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <p>Загрузка...</p>
            ) : bots.length === 0 ? (
              <Card className="bg-card/50">
                <CardContent className="py-12 text-center">
                  <Icon name="Bot" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">У вас пока нет ботов</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {bots.map((bot) => (
                  <Card key={bot.id} className="bg-card/50 border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle>{bot.name}</CardTitle>
                        <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                          {bot.status === 'running' ? '🟢 Работает' : '🔴 Остановлен'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted p-3 rounded font-mono text-xs break-all">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Key" size={14} />
                          <span className="text-xs">Токен</span>
                        </div>
                        <span>{bot.token}</span>
                      </div>
                      <div className="flex gap-2">
                        {bot.status === 'running' ? (
                          <Button size="sm" variant="outline" onClick={() => handleBotControl(bot.id, 'stop')}>
                            <Icon name="Square" className="mr-1" size={14} />
                            Остановить
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-primary" onClick={() => handleBotControl(bot.id, 'start')}>
                            <Icon name="Play" className="mr-1" size={14} />
                            Запустить
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
                <CardDescription>Информация о вашем аккаунте</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>
                <div>
                  <Label>Баланс</Label>
                  <Input value={`${user.balance.toFixed(2)} ₽`} disabled />
                </div>
                {user.is_admin && (
                  <Badge className="bg-secondary">Администратор</Badge>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
