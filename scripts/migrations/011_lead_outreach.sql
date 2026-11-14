-- Admin → Lead Outreach: find businesses (Google Places), check their
-- website (email + PageSpeed), write a personal email with AI, send it over
-- SMTP. Secrets in outreach_settings are AES-256-GCM encrypted by the app
-- (ENCRYPTION_KEY) before they get here.
CREATE TABLE IF NOT EXISTS outreach_settings (
  setting_key VARCHAR(64) PRIMARY KEY,
  setting_value TEXT NULL,
  is_secret TINYINT(1) NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS outreach_leads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  place_id VARCHAR(255) NULL,
  business_name VARCHAR(255) NOT NULL,
  category VARCHAR(120) NULL,
  city VARCHAR(120) NULL,
  country VARCHAR(120) NULL,
  address VARCHAR(512) NULL,
  phone VARCHAR(40) NULL,
  website VARCHAR(1024) NULL,
  website_domain VARCHAR(255) NULL,
  rating DECIMAL(2,1) NULL,
  rating_count INT UNSIGNED NULL,
  email VARCHAR(255) NULL,
  email_source VARCHAR(1024) NULL COMMENT 'page the email was found on',
  pagespeed_score TINYINT UNSIGNED NULL COMMENT 'mobile performance 0-100',
  pagespeed_issues JSON NULL,
  enrich_status ENUM('pending','done','failed') NOT NULL DEFAULT 'pending',
  enrich_error VARCHAR(500) NULL,
  draft_subject VARCHAR(255) NULL,
  draft_body TEXT NULL,
  draft_status ENUM('none','draft','approved') NOT NULL DEFAULT 'none',
  status ENUM('new','emailed','replied','unsubscribed','bounced') NOT NULL DEFAULT 'new',
  unsubscribe_token CHAR(43) NOT NULL,
  last_emailed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_outreach_leads_place (place_id),
  UNIQUE KEY uq_outreach_leads_domain (website_domain),
  UNIQUE KEY uq_outreach_leads_unsub (unsubscribe_token),
  INDEX idx_outreach_leads_status (status, draft_status),
  INDEX idx_outreach_leads_enrich (enrich_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Addresses that must never be emailed again (unsubscribed, bounced).
CREATE TABLE IF NOT EXISTS outreach_suppressions (
  email VARCHAR(255) PRIMARY KEY,
  reason ENUM('unsubscribed','bounced','manual') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS email_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id INT UNSIGNED NULL,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NULL,
  status ENUM('sent','failed','test') NOT NULL,
  error_message VARCHAR(1000) NULL,
  message_id VARCHAR(255) NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_email_logs_lead FOREIGN KEY (lead_id) REFERENCES outreach_leads(id) ON DELETE SET NULL,
  INDEX idx_email_logs_sent (sent_at, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
