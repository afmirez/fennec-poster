export interface Frontmatter {
  title: string;
  description: string;
  order: number;
  tags: string[];
  category: string;
  id: string;
}

export interface NoteRecord {
  frontmatter: Frontmatter;
  html: string;
}
