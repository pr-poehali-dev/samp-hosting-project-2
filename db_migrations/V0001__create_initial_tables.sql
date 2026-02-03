-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Servers table (SAMP/CRMP)
CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50),
    port INTEGER,
    status VARCHAR(50) DEFAULT 'stopped',
    mod VARCHAR(100),
    max_players INTEGER DEFAULT 50,
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bots table (Telegram)
CREATE TABLE IF NOT EXISTS bots (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'stopped',
    webhook_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forums table
CREATE TABLE IF NOT EXISTS forums (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    server_id INTEGER REFERENCES servers(id),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) UNIQUE,
    style VARCHAR(100),
    admin_username VARCHAR(100) DEFAULT 'admin',
    admin_password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (email, password_hash, balance, is_admin)
VALUES ('admin@admin.com', '$2b$10$rFZqN5XqNQZ5fXH5YqZqOuKJ5YqZqOuKJ5YqZqOuKJ5YqZqOu', 999999.00, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_servers_user_id ON servers(user_id);
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON bots(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_forums_user_id ON forums(user_id);