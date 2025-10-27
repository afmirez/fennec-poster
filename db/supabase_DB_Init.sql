-- ==========================================
-- CREATE PRIVATE SCHEMA
-- ==========================================
CREATE SCHEMA IF NOT EXISTS fennec_poster

-- ==========================================
-- EXPOSING SCHEMA
-- ==========================================
GRANT USAGE ON SCHEMA fennec_poster TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA fennec_poster
 TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA fennec_poster
 TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA fennec_poster
 TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA fennec_poster
 GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA fennec_poster
 GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA fennec_poster
 GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ==========================================
-- TABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS fennec_poster.category (
  id   uuid DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL,
  CONSTRAINT pk_category PRIMARY KEY (id),
  CONSTRAINT ux_category_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS fennec_poster.tag (
  id   uuid DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL,
  CONSTRAINT pk_tag PRIMARY KEY (id),
  CONSTRAINT ux_tag_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS fennec_poster.note (
  id           uuid DEFAULT gen_random_uuid(),
  category_id  uuid NOT NULL,
  title        varchar(100) NOT NULL,
  sort_order   int NOT NULL,
  description  varchar(250) NOT NULL,
  CONSTRAINT pk_note PRIMARY KEY (id),
  CONSTRAINT fk_note_category
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
  CONSTRAINT ux_note_category_title UNIQUE (category_id, title)
);

CREATE TABLE IF NOT EXISTS fennec_poster.note_tags (
  note_id uuid NOT NULL,
  tag_id  uuid NOT NULL,
  CONSTRAINT pk_note_tags PRIMARY KEY (note_id, tag_id),
  CONSTRAINT fk_note_tags_note
    FOREIGN KEY (note_id) REFERENCES note(id) ON DELETE CASCADE,
  CONSTRAINT fk_note_tags_tag
    FOREIGN KEY (tag_id)  REFERENCES tag(id)  ON DELETE CASCADE
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_note_tags_tag_id  ON fennec_poster.note_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON fennec_poster.note_tags(note_id);