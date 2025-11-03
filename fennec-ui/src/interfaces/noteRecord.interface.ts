export interface Frontmatter {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export interface NoteRecord {
  frontmatter: Frontmatter;
  html: string;
}
