-- Voluntariado IFRS
-- Script inicial de estrutura e dados fictícios para MySQL.
-- Execute em ambiente de desenvolvimento/teste. Não apaga tabelas existentes.

CREATE DATABASE IF NOT EXISTS voluntariado_ifrs
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE voluntariado_ifrs;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'volunteer') NOT NULL DEFAULT 'volunteer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  event_date DATETIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  max_volunteers INT UNSIGNED NOT NULL DEFAULT 20,
  status ENUM('open', 'closed', 'completed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS volunteers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_volunteers_email (email)
) ENGINE=InnoDB;

-- Dados fictícios para demonstração.
-- Crie o administrador com as variáveis ADMIN_NAME, ADMIN_EMAIL e
-- ADMIN_PASSWORD do backend/.env e execute `node src/seedAdmin.js`
-- dentro da pasta backend. Não armazene senhas em texto puro.

INSERT INTO events
  (title, description, event_date, location, max_volunteers, status)
SELECT
  'Campanha de Arrecadação de Alimentos',
  'Arrecadação de alimentos não perecíveis para famílias da comunidade.',
  '2026-11-15 09:00:00',
  'Campus IFRS',
  30,
  'open'
WHERE NOT EXISTS (
  SELECT 1 FROM events
  WHERE title = 'Campanha de Arrecadação de Alimentos'
);

INSERT INTO events
  (title, description, event_date, location, max_volunteers, status)
SELECT
  'Mutirão de Limpeza do Parque',
  'Ação comunitária de cuidado com os espaços públicos.',
  '2026-12-05 08:30:00',
  'Parque Municipal',
  20,
  'open'
WHERE NOT EXISTS (
  SELECT 1 FROM events
  WHERE title = 'Mutirão de Limpeza do Parque'
);

INSERT INTO volunteers (name, email, phone)
SELECT 'Mariana Oliveira', 'mariana.oliveira@example.com', '54999990001'
WHERE NOT EXISTS (
  SELECT 1 FROM volunteers WHERE email = 'mariana.oliveira@example.com'
);

INSERT INTO volunteers (name, email, phone)
SELECT 'Lucas Ferreira', 'lucas.ferreira@example.com', '54999990002'
WHERE NOT EXISTS (
  SELECT 1 FROM volunteers WHERE email = 'lucas.ferreira@example.com'
);
