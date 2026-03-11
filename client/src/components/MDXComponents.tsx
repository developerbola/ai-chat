import { type Components } from "react-markdown";

export const MDXComponents: Components = {
  h1: (props) => <h1 className="text-4xl mt-6 mb-4" {...props} />,
  h2: (props) => <h2 className="text-3xl mt-5 mb-3" {...props} />,
  h3: (props) => <h3 className="text-2xl mt-4 mb-2" {...props} />,
  h4: ({ children, ...props }) => (
    <h4 className="text-xl mt-3 mb-2" {...props} />
  ),
  h5: (props) => <h4 className="text-xl mt-3 mb-2" {...props} />,
  h6: (props) => <h6 className="text-base mt-2 mb-1" {...props} />,
  p: (props) => (
    <div
      className="sm:text-base text-sm leading-6 mb-4 font-[300]"
      {...props}
    />
  ),
  a: (props) => <a {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-foreground bg-foreground/10 px-4 my-4"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-6 border-foreground/10" {...props} />,
  table: (props) => (
    <table
      className="table-auto border-collapse border border-foreground/40 my-4"
      {...props}
    />
  ),
  thead: (props) => <thead className="bg-foreground/10" {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => <tr className="border-b border-foreground/40" {...props} />,
  th: (props) => (
    <th
      className="px-4 py-2 text-left font-semibold border border-foreground/40"
      {...props}
    />
  ),
  td: (props) => (
    <td className="px-4 py-2 border border-foreground/40" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
  ),
  li: (props) => (
    <li className="leading-normal text-foreground/85" {...props} />
  ),
  code: (props) => (
    <code
      className="px-1 py-0.75 rounded-[4px] font-mono bg-foreground/10 text-sm"
      {...props}
    />
  ),
  pre: ({ children }) => {
    return (
      <pre className="rounded-md max-w-[90vw] p-2 overflow-x-auto text-[11px] sm:text-[13px]">
        {children}
      </pre>
    );
  },
};
