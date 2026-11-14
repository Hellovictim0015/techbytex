-- Admin → Lead Assign: leads added by hand, handed to marketing team members.
-- Each member gets a private link (access_token) that shows only their leads.
CREATE TABLE IF NOT EXISTS team_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NULL,
  access_token CHAR(43) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_team_members_token (access_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sales_leads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  business VARCHAR(255) NULL,
  city VARCHAR(120) NULL,
  website_url VARCHAR(1024) NULL,
  requirement TEXT NULL,
  assigned_to INT UNSIGNED NULL,
  status ENUM('new','call_done','follow_up','converted','cancelled') NOT NULL DEFAULT 'new',
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_leads_member FOREIGN KEY (assigned_to) REFERENCES team_members(id) ON DELETE SET NULL,
  CONSTRAINT fk_sales_leads_user FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_sales_leads_member (assigned_to, status),
  INDEX idx_sales_leads_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Every status change / call note, by the admin or the team member.
CREATE TABLE IF NOT EXISTS sales_lead_updates (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id INT UNSIGNED NOT NULL,
  status ENUM('new','call_done','follow_up','converted','cancelled') NULL,
  note TEXT NULL,
  actor_name VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_lead_updates_lead FOREIGN KEY (lead_id) REFERENCES sales_leads(id) ON DELETE CASCADE,
  INDEX idx_sales_lead_updates_lead (lead_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
