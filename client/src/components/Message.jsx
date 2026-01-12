import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { githubDarkTheme } from "../styles/syntax-theme";
import { User, Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Message = ({ role, content }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 p-6 ${
        role === "assistant"
          ? "bg-(--glass-bg) border-y border-(--glass-border)"
          : ""
      }`}
    >
      <div
        className={`mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          role === "assistant" ? "bg-(--accent-blue)" : "bg-(--bg-accent)"
        }`}
      >
        {role === "assistant" ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-(--text-secondary)">
            {role === "assistant" ? "AI Assistant" : "You"}
          </span>
          <button
            onClick={copyToClipboard}
            className="text-(--text-secondary) hover:text-(--text-primary) transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={githubDarkTheme}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
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
    </motion.div>
  );
};
