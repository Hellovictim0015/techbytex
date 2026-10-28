-- Campaigns can also go out as approved WhatsApp templates (Fast2SMS WhatsApp API).
ALTER TABLE sms_campaigns
  MODIFY route ENUM('dlt','q','whatsapp') NOT NULL DEFAULT 'dlt';
