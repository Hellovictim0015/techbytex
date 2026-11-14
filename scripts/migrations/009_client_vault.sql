-- Admin → Client Vault: logins and links saved per client. Passwords and
-- notes are AES-256-GCM encrypted by the app (VAULT_KEY) before they get here.
CREATE TABLE IF NOT EXISTS vault_clients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  contact VARCHAR(255) NULL COMMENT 'phone / email of the client',
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vault_clients_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vault_entries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id INT UNSIGNED NOT NULL,
  entry_type VARCHAR(40) NOT NULL DEFAULT 'other',
  title VARCHAR(255) NOT NULL,
  login_url VARCHAR(1024) NULL,
  website_url VARCHAR(1024) NULL,
  username VARCHAR(255) NULL,
  password_enc TEXT NULL,
  notes_enc TEXT NULL,
  expires_on DATE NULL COMMENT 'renewal date for domains, hosting, SSL',
  created_by INT UNSIGNED NULL,
  last_revealed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vault_entries_client FOREIGN KEY (client_id) REFERENCES vault_clients(id) ON DELETE CASCADE,
  CONSTRAINT fk_vault_entries_user FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_vault_entries_client (client_id),
  INDEX idx_vault_entries_expiry (expires_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
