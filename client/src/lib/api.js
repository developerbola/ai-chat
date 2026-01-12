export const streamChat = async (messages, model, onChunk) => {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, model }),
  });

  if (!response.ok) {
    throw new Error("Failed to connect to server");
  }

  const reader = response.body.getReader();
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
