-- TechByteX admin/AI system schema.
-- Additive only: every statement is CREATE TABLE IF NOT EXISTS.
-- Safe to run repeatedly (see scripts/migrate.mjs). Never edit this file to add
-- DROP/ALTER-destructive statements — create a new migration file instead.

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_sessions (
  id VARCHAR(64) PRIMARY KEY,
  admin_user_id INT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(64),
  user_agent VARCHAR(512),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  CONSTRAINT fk_admin_sessions_user FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_admin_sessions_user (admin_user_id),
  INDEX idx_admin_sessions_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT UNSIGNED NULL,
  actor_label VARCHAR(255) NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100) NULL,
  target_id VARCHAR(255) NULL,
  details JSON NULL,
  ip_address VARCHAR(64),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_logs_user FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_audit_logs_action (action),
  INDEX idx_audit_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ai_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSON NOT NULL,
  updated_by INT UNSIGNED NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_settings_user FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  page_path VARCHAR(512) NULL,
  issue TEXT NOT NULL,
  current_value TEXT NULL,
  suggested_value TEXT NULL,
  reason TEXT NULL,
  priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  status ENUM('pending','approved','rejected','applied') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INT UNSIGNED NULL,
  reviewed_at DATETIME NULL,
  applied_at DATETIME NULL,
  CONSTRAINT fk_ai_recs_user FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_ai_recs_status (status),
  INDEX idx_ai_recs_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ai_analysis_reports (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  report_type VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  data JSON NULL,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_reports_user FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_ai_reports_type (report_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ai_generation_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_type VARCHAR(100) NOT NULL,
  status ENUM('started','success','failed') NOT NULL DEFAULT 'started',
  input_summary TEXT NULL,
  output_summary TEXT NULL,
  error_message TEXT NULL,
  tokens_used INT UNSIGNED NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME NULL,
  INDEX idx_ai_gen_logs_type (job_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS seo_snapshots (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  total_clicks INT UNSIGNED NOT NULL DEFAULT 0,
  total_impressions INT UNSIGNED NOT NULL DEFAULT 0,
  average_ctr DECIMAL(6,4) NOT NULL DEFAULT 0,
  average_position DECIMAL(6,2) NOT NULL DEFAULT 0,
  raw_data JSON NULL,
  fetched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_seo_snapshots_range (date_range_start, date_range_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS seo_keyword_metrics (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  snapshot_id INT UNSIGNED NOT NULL,
  query TEXT NOT NULL,
  clicks INT UNSIGNED NOT NULL DEFAULT 0,
  impressions INT UNSIGNED NOT NULL DEFAULT 0,
  ctr DECIMAL(6,4) NOT NULL DEFAULT 0,
  position DECIMAL(6,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_seo_keyword_snapshot FOREIGN KEY (snapshot_id) REFERENCES seo_snapshots(id) ON DELETE CASCADE,
  INDEX idx_seo_keyword_snapshot (snapshot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS seo_page_metrics (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  snapshot_id INT UNSIGNED NOT NULL,
  page_path VARCHAR(512) NOT NULL,
  clicks INT UNSIGNED NOT NULL DEFAULT 0,
  impressions INT UNSIGNED NOT NULL DEFAULT 0,
  ctr DECIMAL(6,4) NOT NULL DEFAULT 0,
  position DECIMAL(6,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_seo_page_snapshot FOREIGN KEY (snapshot_id) REFERENCES seo_snapshots(id) ON DELETE CASCADE,
  INDEX idx_seo_page_snapshot (snapshot_id),
  INDEX idx_seo_page_path (page_path(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  users INT UNSIGNED NOT NULL DEFAULT 0,
  sessions INT UNSIGNED NOT NULL DEFAULT 0,
  page_views INT UNSIGNED NOT NULL DEFAULT 0,
  engagement_rate DECIMAL(6,4) NOT NULL DEFAULT 0,
  raw_data JSON NULL,
  fetched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_analytics_snapshots_range (date_range_start, date_range_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blog_ai_jobs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_date DATE NOT NULL,
  job_number TINYINT UNSIGNED NOT NULL COMMENT 'slot 1-5 for the day',
  status ENUM('pending','running','completed','failed','skipped') NOT NULL DEFAULT 'pending',
  topic VARCHAR(512) NULL,
  blog_slug VARCHAR(255) NULL,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  error_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_blog_job_slot (job_date, job_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blog_generation_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id INT UNSIGNED NOT NULL,
  step VARCHAR(100) NOT NULL,
  status ENUM('started','success','failed') NOT NULL DEFAULT 'started',
  message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_blog_gen_logs_job FOREIGN KEY (job_id) REFERENCES blog_ai_jobs(id) ON DELETE CASCADE,
  INDEX idx_blog_gen_logs_job (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI-generated blog posts. Kept separate from the existing static
-- src/app/data/blogData.js array (which is untouched) until the blog pages
-- are wired to merge DB-backed posts in a later phase.
CREATE TABLE IF NOT EXISTS ai_blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(512) NOT NULL,
  excerpt TEXT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100) NULL,
  keywords JSON NULL,
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  faq JSON NULL,
  structured_data JSON NULL,
  featured_image_url VARCHAR(1024) NULL,
  featured_image_alt VARCHAR(512) NULL,
  status ENUM('draft','scheduled','published','rejected') NOT NULL DEFAULT 'draft',
  job_id INT UNSIGNED NULL,
  generated_by VARCHAR(50) NOT NULL DEFAULT 'ai',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_blog_job FOREIGN KEY (job_id) REFERENCES blog_ai_jobs(id) ON DELETE SET NULL,
  INDEX idx_ai_blog_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
