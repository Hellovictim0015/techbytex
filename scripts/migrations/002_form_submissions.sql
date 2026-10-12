-- Every website form submission (contact, consultation, newsletter, ...).
-- `data` keeps the full original payload so new form fields never get lost.
CREATE TABLE IF NOT EXISTS form_submissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  service VARCHAR(255) NULL,
  message TEXT NULL,
  data JSON NULL,
  page_path VARCHAR(512) NULL,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(512) NULL,
  email_sent TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('new','contacted','closed','spam') NOT NULL DEFAULT 'new',
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_form_submissions_type (form_type),
  INDEX idx_form_submissions_status (status),
  INDEX idx_form_submissions_created (created_at),
  INDEX idx_form_submissions_ip (ip_address, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
