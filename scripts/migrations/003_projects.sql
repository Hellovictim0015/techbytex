-- Homepage "Recent Projects" — managed from Admin → Projects.
CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  image_url VARCHAR(1024) NOT NULL,
  link_url VARCHAR(1024) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_order (is_visible, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed with the projects that were hardcoded in PortfolioSection.js.
INSERT INTO projects (title, subtitle, image_url, sort_order) VALUES
  ('Florestawud', 'E-Commerce Website', '/Screenshot 2026-01-11 191907.png', 1),
  ('MCQ Exam', 'App', '/Screenshot 2025-07-30 035239.png', 2),
  ('ग्राम पंचायत बिहार', 'Public Service Website', '/Screenshot 2026-01-11 192900.png', 3),
  ('StoreNSource', 'E-Commerce Website', '/Screenshot 2026-01-11 192542.png', 4),
  ('Indian expoeters', 'Manufacturing Website', '/Screenshot 2026-01-11 193241.png', 5),
  ('Spa', 'Website', '/Screenshot 2026-01-11 195839.png', 6);
