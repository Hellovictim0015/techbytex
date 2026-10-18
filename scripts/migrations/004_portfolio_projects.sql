-- /portfolio page projects — managed from Admin → Portfolio.
-- Seed rows (and their images) are added by `npm run portfolio:import`.
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  seo_heading VARCHAR(255) NULL,
  description TEXT NULL,
  image_url VARCHAR(1024) NOT NULL,
  alt_text VARCHAR(512) NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Website',
  client_type VARCHAR(255) NULL,
  role VARCHAR(255) NULL,
  stats JSON NULL,
  technologies JSON NULL,
  features JSON NULL,
  case_problem TEXT NULL,
  case_solution TEXT NULL,
  case_result TEXT NULL,
  link_url VARCHAR(1024) NULL,
  video_url VARCHAR(1024) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_portfolio_order (is_visible, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
