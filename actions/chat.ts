"use server";
import { streamText } from "ai";
import { gemini } from "@/lib/gemini";
import { createStreamableValue } from "@ai-sdk/rsc";
import { Message } from "@/types/message";

export const chat = async (history: Message[]) => {
  const stream = createStreamableValue();

  (async () => {
    const { textStream } = streamText({
      model: gemini("gemini-2.0-flash"),
      messages: history,
    });

    for await (const chunk of textStream) {
      stream.update(chunk);
    }
    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
};
