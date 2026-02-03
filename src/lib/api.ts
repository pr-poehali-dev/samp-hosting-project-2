const API_URLS = {
  auth: 'https://functions.poehali.dev/6edb855c-9f9b-48d4-ab5a-cdbdee05fe75',
  servers: 'https://functions.poehali.dev/955722bc-9d26-4018-8fc6-440bfc65f6d7',
  admin: 'https://functions.poehali.dev/7fdd2689-c991-4aae-84a9-a6928cb048cb',
};

export interface User {
  id: number;
  email: string;
  balance: number;
  is_admin: boolean;
}

export interface Server {
  id: number;
  name: string;
  type: string;
  plan: string;
  ip_address: string;
  port: number;
  status: string;
  mod?: string;
  max_players: number;
  created_at: string;
}

export interface Bot {
  id: number;
  name: string;
  token: string;
  status: string;
  webhook_url: string;
  created_at: string;
}

export const api = {
  auth: {
    register: async (email: string, password: string) => {
      const res = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password }),
      });
      return res.json();
    },
    login: async (email: string, password: string) => {
      const res = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      return res.json();
    },
  },
  
  admin: {
    getUsers: async () => {
      const res = await fetch(API_URLS.admin);
      return res.json();
    },
    updateBalance: async (userId: number, amount: number) => {
      const res = await fetch(API_URLS.admin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_balance', user_id: userId, amount }),
      });
      return res.json();
    },
  },
  
  servers: {
    getAll: async (userId: number) => {
      const res = await fetch(`${API_URLS.servers}?user_id=${userId}`);
      return res.json();
    },
    createServer: async (userId: number, name: string, type: string, plan: string, mod?: string) => {
      const res = await fetch(API_URLS.servers, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_server', user_id: userId, name, type, plan, mod }),
      });
      return res.json();
    },
    controlServer: async (serverId: number, command: string) => {
      const res = await fetch(API_URLS.servers, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'control_server', server_id: serverId, command }),
      });
      return res.json();
    },
    createBot: async (userId: number, name: string, token: string) => {
      const res = await fetch(API_URLS.servers, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_bot', user_id: userId, name, token }),
      });
      return res.json();
    },
    controlBot: async (botId: number, command: string) => {
      const res = await fetch(API_URLS.servers, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'control_bot', bot_id: botId, command }),
      });
      return res.json();
    },
  },
};
