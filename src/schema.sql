CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  original_price REAL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT,
  stock INTEGER DEFAULT 100,
  sold INTEGER DEFAULT 0,
  is_hot INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  pay_method TEXT,
  email TEXT,
  download_link TEXT,
  extract_code TEXT,
  created_at TEXT NOT NULL,
  confirmed_at TEXT,
  cancelled_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO users (id, username, password, email, role, created_at) VALUES 
(1, '2249144723', 'liqian666', '2249144723@qq.com', 'admin', '2024-01-01T00:00:00Z'),
(2, '123456', 'liqian666', '123456@example.com', 'user', '2024-01-01T00:00:00Z');

INSERT OR IGNORE INTO products (id, name, price, original_price, category, description, image, stock, sold, is_hot) VALUES
(1, 'STM32F103基础教程', 29.9, 59.9, 'docs', 'STM32F103入门到精通，包含寄存器开发和HAL库开发', 'https://via.placeholder.com/200x200', 100, 0, 1),
(2, 'FreeRTOS实战项目', 39.9, 79.9, 'project', '基于STM32的FreeRTOS项目实战，包含任务管理、队列、信号量等', 'https://via.placeholder.com/200x200', 100, 0, 1),
(3, 'STM32 HAL库源码解析', 49.9, 99.9, 'code', 'STM32 HAL库底层源码深度解析', 'https://via.placeholder.com/200x200', 100, 0, 0),
(4, 'Linux驱动开发入门', 59.9, 119.9, 'docs', 'Linux内核驱动开发入门教程', 'https://via.placeholder.com/200x200', 100, 0, 1),
(5, 'RT-Thread项目实战', 35.9, 69.9, 'project', 'RT-Thread实时操作系统项目实战', 'https://via.placeholder.com/200x200', 100, 0, 0),
(6, 'STM32 Bootloader源码', 25.9, 49.9, 'code', 'STM32 Bootloader完整源码，支持串口升级', 'https://via.placeholder.com/200x200', 100, 0, 0);