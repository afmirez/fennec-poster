import { redirect } from "next/navigation";
import { getCategoryNotesMeta } from "@/services/noteService";

interface NotesPageProps {
  params: { id: string };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { id } = await params;

  const notesMeta = await getCategoryNotesMeta(id);

  if (!notesMeta.length) {
    return <p>No notes available in this category.</p>;
  }

  const firstNoteId = notesMeta[0].id;

  redirect(`/notes/${id}/${firstNoteId}`);
}
