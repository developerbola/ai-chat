import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { MDXComponents } from "./MDXComponents";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export const Message: React.FC<MessageProps> = ({ role, content }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAssistant = role === "assistant";

  return (
    <div
      className={`flex w-full mb-6 overflow-auto animate-fade-in ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-6 py-4 flex items-center relative group transition-all duration-300 ${
          isAssistant ? "text-primary" : "bg-accent"
        }`}
      >
        <div
          className={`max-w-none text-[15px] leading-relaxed ${
            isAssistant ? "prose dark:prose-invert" : "prose-invert"
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={MDXComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      <div
        className={`flex items-center justify-between mb-2 gap-4 ${
          isAssistant ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size={"icon-sm"}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100 p-1 rounded-md hover:bg-white/10"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </Button>
      </div>
    </div>
  );
};
