export const streamChat = async (
  messages: any[],
  model: string,
  onChunk: (chunk: string) => void
) => {
  const backendURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${backendURL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, model }),
  });

  if (!response.ok) {
    throw new Error("Failed to connect to server");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      onChunk(chunk);
    }
  }
};
