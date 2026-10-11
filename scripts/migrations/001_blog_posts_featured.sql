-- Blog posts now live in ai_blog_posts for both AI-generated and imported
-- (formerly static blogData.js) articles. `is_featured` carries the old
-- `featured` flag used by the /blog hero card.
ALTER TABLE ai_blog_posts
  ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER status;
