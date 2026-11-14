-- Lead Outreach: leads can also come from an uploaded sheet or be typed in by
-- hand, and carry the contact person's name for the greeting.
ALTER TABLE outreach_leads
  ADD COLUMN contact_name VARCHAR(255) NULL AFTER business_name,
  ADD COLUMN source ENUM('places','import','manual') NOT NULL DEFAULT 'places' AFTER contact_name,
  ADD INDEX idx_outreach_leads_email (email);
