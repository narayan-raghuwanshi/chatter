import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Chat } from "@/models/Chat";

// GET: fetch all chats
export async function GET() {
  await connectToDB();
  const chats = await Chat.find({}).sort({ updatedAt: -1 });
  return NextResponse.json(chats);
}

// POST: create new chat
export async function POST(req: NextRequest) {
  await connectToDB();
  const { title } = await req.json();
  const chat = new Chat({ title, messages: [] });
  await chat.save();
  return NextResponse.json(chat);
}

// DELETE: delete a chat by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  await connectToDB();
  const { chatId } = await params;
  await Chat.findByIdAndDelete(chatId);
  return NextResponse.json({ message: "Chat deleted" });
}

// PATCH: update a chat by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  await connectToDB();
  const { chatId } = await params;
  const { title } = await req.json();
  const chat = await Chat.findByIdAndUpdate(chatId, { title }, { new: true });
  return NextResponse.json(chat);
}
