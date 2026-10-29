-- Enquiry-update WhatsApp template: each contact can carry their own service ({{2}}).
ALTER TABLE sms_recipients
  ADD COLUMN service VARCHAR(255) NULL AFTER name;
