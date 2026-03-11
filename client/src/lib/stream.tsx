export const streamChat = async (
  messages: any[],
  chat_id: string | null,
  onChunk: (chunk: string) => void,
) => {
  const session = sessionStorage.getItem("user");
  let token;
  if (session) {
    const user = JSON.parse(session) as { access_token?: string };
    token = user.access_token;
  }
  const backendURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${backendURL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, model: "gpt-oss-120b", chat_id }),
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
