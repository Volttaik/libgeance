-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =====================================================================
-- ETII Commerce Hub – Database Schema
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
  id        BIGSERIAL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  email     TEXT UNIQUE NOT NULL,
  phone     TEXT NOT NULL,
  password  TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id        BIGSERIAL PRIMARY KEY,
  name      TEXT NOT NULL UNIQUE,
  image     TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  price       REAL NOT NULL,
  description TEXT,
  discount    REAL DEFAULT 0,
  image       TEXT,
  category    TEXT DEFAULT 'General',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id                BIGSERIAL PRIMARY KEY,
  "userId"          BIGINT REFERENCES users(id),
  "customerName"    TEXT NOT NULL,
  "customerEmail"   TEXT NOT NULL,
  "customerPhone"   TEXT NOT NULL,
  "deliveryAddress" TEXT NOT NULL,
  city              TEXT,
  state             TEXT,
  total             REAL NOT NULL,
  status            TEXT DEFAULT 'pending',
  "paystackRef"     TEXT,
  "createdAt"       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id            BIGSERIAL PRIMARY KEY,
  "orderId"     BIGINT NOT NULL REFERENCES orders(id),
  "productId"   BIGINT,
  "productName" TEXT NOT NULL,
  quantity      INTEGER NOT NULL,
  price         REAL NOT NULL
);

-- Disable Row Level Security so the anon/publishable key can read/write freely
ALTER TABLE users        DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories   DISABLE ROW LEVEL SECURITY;
ALTER TABLE products     DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders       DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items  DISABLE ROW LEVEL SECURITY;

-- =====================================================================
-- STORAGE: Create the uploads bucket for product/category images
-- Run this separately if the bucket doesn't already exist:
-- =====================================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('uploads', 'uploads', true)
-- ON CONFLICT DO NOTHING;
