import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Chat } from "@/models/Chat";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  await connectToDB();
  console.log("Fetching messages for chatId:", params);
  const { chatId } = await params;
  const chat = await Chat.findById(chatId);
  if (!chat)
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  return NextResponse.json(chat.messages);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  await connectToDB();
  const { role, content } = await req.json();
  const { chatId } = await params;
  const chat = await Chat.findById(chatId);
  if (!chat)
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });

  chat.messages.push({ role, content });
  chat.updatedAt = new Date();
  await chat.save();

  return NextResponse.json(chat.messages);
}
