-- AI-planned local SEO landing pages — managed from Admin → Location Pages.
-- One location_plans row per targeted place (country/state/district/city);
-- its location_pages rows are served at /{slug} once published.
CREATE TABLE IF NOT EXISTS location_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(150) NULL,
  district VARCHAR(150) NULL,
  city VARCHAR(150) NOT NULL,
  notes TEXT NULL,
  ai_summary TEXT NULL,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_location_plans_user FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS location_pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id INT UNSIGNED NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  service_slug VARCHAR(100) NOT NULL,
  service_label VARCHAR(150) NOT NULL,
  area_name VARCHAR(150) NULL COMMENT 'locality inside the city; NULL = city-level page',
  target_keyword VARCHAR(255) NOT NULL,
  secondary_keywords JSON NULL,
  reason TEXT NULL,
  priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  h1 VARCHAR(255) NULL,
  region_label VARCHAR(150) NULL,
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  intro JSON NULL,
  body_html MEDIUMTEXT NULL,
  industries JSON NULL,
  nearby_areas JSON NULL,
  faqs JSON NULL,
  word_count INT UNSIGNED NULL,
  similarity DECIMAL(4,3) NULL COMMENT 'highest word overlap with another page of the same plan',
  status ENUM('planned','draft','published','rejected','failed') NOT NULL DEFAULT 'planned',
  error_message TEXT NULL,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_location_pages_plan FOREIGN KEY (plan_id) REFERENCES location_plans(id) ON DELETE CASCADE,
  INDEX idx_location_pages_status (status),
  INDEX idx_location_pages_plan (plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
