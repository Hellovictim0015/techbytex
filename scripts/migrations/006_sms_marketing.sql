-- Bulk SMS campaigns from Admin → Marketing (sent through Fast2SMS).
CREATE TABLE IF NOT EXISTS sms_campaigns (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  route ENUM('dlt','q') NOT NULL DEFAULT 'dlt',
  message TEXT NOT NULL COMMENT 'q: full text; dlt: variables in template order, | separated',
  template_id VARCHAR(100) NULL,
  sender_id VARCHAR(20) NULL,
  total INT UNSIGNED NOT NULL DEFAULT 0,
  sent INT UNSIGNED NOT NULL DEFAULT 0,
  failed INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('ready','sending','completed','partial','failed') NOT NULL DEFAULT 'ready',
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  CONSTRAINT fk_sms_campaigns_user FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sms_recipients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT UNSIGNED NOT NULL,
  name VARCHAR(255) NULL,
  phone VARCHAR(15) NOT NULL,
  status ENUM('pending','sent','failed') NOT NULL DEFAULT 'pending',
  request_id VARCHAR(100) NULL,
  error_message VARCHAR(500) NULL,
  sent_at DATETIME NULL,
  CONSTRAINT fk_sms_recipients_campaign FOREIGN KEY (campaign_id) REFERENCES sms_campaigns(id) ON DELETE CASCADE,
  INDEX idx_sms_recipients_campaign (campaign_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
