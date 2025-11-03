import { NoteRecord } from "@/interfaces/Noterecord.interface";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data: NoteRecord[] = await request.json();

  console.log("Data is: ", data);

  return NextResponse.json({
    message: "Just a test",
    haha: "bla",
  });
}
