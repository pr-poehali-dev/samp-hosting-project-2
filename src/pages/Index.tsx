import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const Index = () => {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Free",
      price: "0₽",
      period: "Бесплатно",
      features: [
        "Автоотключение через 2 часа без игроков",
        "Базовый набор модов",
        "IP-адрес сервера",
        "Техподдержка",
        "1 веб-сайт (форум)",
      ],
      badge: "Старт",
      color: "text-muted-foreground",
    },
    {
      name: "VIP",
      price: "250₽",
      period: "месяц",
      features: [
        "Безлимитное время работы",
        "Неограниченные слоты",
        "Приоритетная поддержка",
        "Все моды включены",
        "Автоустановка модов",
        "Компиляция на сайте",
        "Безлимитные форумы",
      ],
      badge: "Популярный",
      color: "text-primary",
      popular: true,
    },
    {
      name: "Super VIP",
      price: "440₽",
      period: "месяц",
      features: [
        "Максимальная производительность",
        "Выделенные ресурсы",
        "Премиум техподдержка 24/7",
        "Все возможности VIP",
        "DDoS защита",
        "Автобэкапы каждый час",
        "Кастомные лаунчеры",
        "Приоритет в очереди",
      ],
      badge: "Pro",
      color: "text-secondary",
    },
  ];

  const mods = [
    { name: "Rodina RP", platform: "PC / Mobile", price: "Бесплатно", author: "@V2ptp", color: "bg-primary" },
    { name: "Radmir RP", platform: "PC", price: "150₽", author: "Официальный", color: "bg-secondary" },
    { name: "Black Russia", platform: "Mobile", price: "Бесплатно", author: "Официальный", color: "bg-accent" },
  ];

  const features = [
    { icon: "Bot", title: "Telegram боты", desc: "Размещайте ботов на хостинге" },
    { icon: "Code2", title: "Компиляция", desc: "Компилируйте код прямо на сайте" },
    { icon: "Rocket", title: "Лаунчеры", desc: "Готовые лаунчеры из открытых источников" },
    { icon: "Package", title: "Автоустановка", desc: "Моды устанавливаются автоматически" },
    { icon: "MessageSquare", title: "Форумы", desc: "Веб-сайты и форумы для вашего сервера" },
    { icon: "Network", title: "IP-адреса", desc: "Настоящие IP для каждого сервера" },
  ];

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
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
              <a href="#plans" className="text-sm font-medium hover:text-primary transition-colors">Тарифы</a>
              <a href="#panel" className="text-sm font-medium hover:text-primary transition-colors">Панель</a>
              <a href="#mods" className="text-sm font-medium hover:text-primary transition-colors">Моды</a>
              <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Услуги</a>
              <a href="#contacts" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
            </div>
            <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary">
              Войти
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 animate-pulse">
          🚀 Лучший хостинг для игровых серверов
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          Lite Host
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Профессиональный хостинг для SAMP/CRMP серверов с автоустановкой модов, компиляцией и лаунчерами
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/login')} size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 glow-primary">
            <Icon name="Rocket" className="mr-2" size={20} />
            Создать сервер
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-primary text-lg px-8 hover:bg-primary/10">
            <Icon name="Play" className="mr-2" size={20} />
            Демо
          </Button>
        </div>
      </section>

      <section id="services" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Возможности платформы
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all hover:glow-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 glow-primary">
                  <Icon name={feature.icon} className="text-white" size={24} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{feature.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="plans" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Тарифные планы
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">Выберите подходящий план для вашего проекта</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <Card 
              key={idx} 
              className={`bg-card/50 backdrop-blur border-2 transition-all hover:scale-105 ${
                plan.popular 
                  ? 'border-primary glow-primary' 
                  : 'border-border/50 hover:border-primary/30'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className={`text-2xl ${plan.color}`}>{plan.name}</CardTitle>
                  <Badge variant={plan.popular ? "default" : "secondary"} className={plan.popular ? "bg-primary glow-primary" : ""}>
                    {plan.badge}
                  </Badge>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                </div>
                <Button 
                  className={plan.popular 
                    ? "w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary" 
                    : "w-full"
                  }
                  variant={plan.popular ? "default" : "outline"}
                >
                  Выбрать план
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Icon name="Check" className="text-primary mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="mods" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Доступные моды
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {mods.map((mod, idx) => (
            <Card key={idx} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className={`w-full h-2 ${mod.color} rounded-t-lg mb-4`}></div>
                <CardTitle className="text-2xl">{mod.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Smartphone" size={16} />
                  {mod.platform}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">{mod.price}</span>
                  <Badge variant="outline">{mod.author}</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  <Icon name="Download" className="mr-2" size={16} />
                  Установить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="panel" className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Панель управления</CardTitle>
            <CardDescription className="text-lg">
              Управляйте своими серверами, модами и форумами из единого интерфейса
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Settings" className="text-primary" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Управление сервером</h4>
                <p className="text-sm text-muted-foreground">Настраивайте название, порты и параметры сервера</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Globe" className="text-secondary" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Веб-сайты</h4>
                <p className="text-sm text-muted-foreground">Создавайте форумы с автоустановкой стилей</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Terminal" className="text-accent" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Компиляция онлайн</h4>
                <p className="text-sm text-muted-foreground">Компилируйте код прямо в браузере</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Shield" className="text-primary" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Безопасность</h4>
                <p className="text-sm text-muted-foreground">Защита от DDoS и регулярные бэкапы</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="contacts" className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl mb-2">Связаться с нами</CardTitle>
            <CardDescription className="text-lg">
              Есть вопросы? Напишите нам в Telegram
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary">
              <Icon name="Send" className="mr-2" size={20} />
              Написать @v2ptp
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border/50 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">© 2024 Lite Host — Лучший хостинг для игровых серверов</p>
          <p className="text-sm">SAMP | CRMP | Автоустановка | Компиляция | Лаунчеры</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;