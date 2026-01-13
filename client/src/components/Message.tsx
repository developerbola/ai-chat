import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { githubDarkTheme } from "../styles/syntax-theme";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${
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
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;
                return !isInline ? (
                  <SyntaxHighlighter
                    style={githubDarkTheme as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className={`${className} bg-black/20 px-1.5 py-0.5 rounded text-sm`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
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
    </motion.div>
  );
};
