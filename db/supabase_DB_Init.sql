-- ==========================================
-- CREATE PRIVATE SCHEMA
-- ==========================================
CREATE SCHEMA IF NOT EXISTS fennec_poster;

-- ==========================================
-- EXPOSING SCHEMA (only for anon)
-- ==========================================
GRANT USAGE ON SCHEMA fennec_poster TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA fennec_poster TO anon;
GRANT ALL ON ALL ROUTINES IN SCHEMA fennec_poster TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA fennec_poster TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA fennec_poster
  GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA fennec_poster
  GRANT ALL ON ROUTINES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA fennec_poster
  GRANT ALL ON SEQUENCES TO anon;

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
  id           uuid NOT NULL,
  category_id  uuid NOT NULL,
  title        varchar(100) NOT NULL,
  sort_order   int NOT NULL,
  description  varchar(250) NOT NULL,
  html         text NOT NULL,
  CONSTRAINT pk_note PRIMARY KEY (id),
  CONSTRAINT fk_note_category
    FOREIGN KEY (category_id) REFERENCES fennec_poster.category(id) ON DELETE CASCADE,
  CONSTRAINT ux_note_category_title UNIQUE (category_id, title),
  CONSTRAINT ux_note_category_sort_order UNIQUE (category_id, sort_order)
);

CREATE TABLE IF NOT EXISTS fennec_poster.note_tags (
  note_id uuid NOT NULL,
  tag_id  uuid NOT NULL,
  CONSTRAINT pk_note_tags PRIMARY KEY (note_id, tag_id),
  CONSTRAINT fk_note_tags_note
    FOREIGN KEY (note_id) REFERENCES fennec_poster.note(id) ON DELETE CASCADE,
  CONSTRAINT fk_note_tags_tag
    FOREIGN KEY (tag_id)  REFERENCES fennec_poster.tag(id) ON DELETE CASCADE
);

-- ==========================================
-- ROW LEVEL SECURITY SETUP
-- ==========================================
ALTER TABLE fennec_poster.category ENABLE ROW LEVEL SECURITY;
ALTER TABLE fennec_poster.tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE fennec_poster.note ENABLE ROW LEVEL SECURITY;
ALTER TABLE fennec_poster.note_tags ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES - CONTENT TABLES (READ)
-- ==========================================
DROP POLICY IF EXISTS "Fennect UI can VIEW categories" on fennec_poster.category;
CREATE POLICY "Fennect UI can VIEW categories"
ON fennec_poster.category
FOR SELECT
to anon
USING(true);


DROP POLICY IF EXISTS "Fennect UI can VIEW tags" on fennec_poster.tag;
CREATE POLICY "Fennect UI can VIEW tags"
ON fennec_poster.tag
FOR SELECT
to anon
USING(true);

DROP POLICY IF EXISTS "Fennect UI can VIEW notes" on fennec_poster.note;
CREATE POLICY "Fennect UI can VIEW notes"
ON fennec_poster.note
FOR SELECT
to anon
USING(true);

DROP POLICY IF EXISTS "Fennect UI can VIEW note_tags" on fennec_poster.note_tags;
CREATE POLICY "Fennect UI can VIEW note_tags"
ON fennec_poster.note_tags
FOR SELECT
to anon
USING(true);

-- ==========================================
-- RLS POLICIES - CONTENT TABLES (CREATE)
-- ==========================================
DROP POLICY IF EXISTS "Fennect UI can CREATE categories" ON fennec_poster.category;
CREATE POLICY "Fennect UI can CREATE categories"
ON fennec_poster.category
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Fennect UI can CREATE tags" ON fennec_poster.tag;
CREATE POLICY "Fennect UI can CREATE tags"
ON fennec_poster.tag
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Fennect UI can CREATE notes" ON fennec_poster.note;
CREATE POLICY "Fennect UI can CREATE notes"
ON fennec_poster.note
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Fennect UI can CREATE note_tags" ON fennec_poster.note_tags;
CREATE POLICY "Fennect UI can CREATE note_tags"
ON fennec_poster.note_tags
FOR INSERT
TO anon
WITH CHECK (true);

-- ==========================================
-- RLS POLICIES - CONTENT TABLES (EDIT)
-- ==========================================
DROP POLICY IF EXISTS "Fennect UI can EDIT notes" on fennec_poster.note;
CREATE POLICY "Fennect UI can EDIT notes"
ON fennec_poster.note
FOR UPDATE
to anon
USING(true);

DROP POLICY IF EXISTS "Fennect UI can EDIT note_tags" on fennec_poster.note_tags;
CREATE POLICY "Fennect UI can EDIT note_tags"
ON fennec_poster.note_tags
FOR UPDATE
to anon
USING(true);

-- ==========================================
-- RLS POLICIES - CONTENT TABLES
-- ==========================================
DROP POLICY IF EXISTS "Fennect UI can DELETE categories" on fennec_poster.category;
CREATE POLICY "Fennect UI can DELETE categories"
ON fennec_poster.category
FOR DELETE
to anon
USING(true);

DROP POLICY IF EXISTS "Fennect UI can DELETE note_tags" on fennec_poster.note_tags;
CREATE POLICY "Fennect UI can DELETE note_tags"
ON fennec_poster.note_tags
FOR DELETE
to anon
USING(true);