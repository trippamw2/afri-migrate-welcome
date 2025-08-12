import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Minus, Send, MessageSquare } from "lucide-react";

export type FAQ = { q: string; a: string };

interface HelpAssistantProps {
  faqs: FAQ[];
}

export default function HelpAssistant({ faqs }: HelpAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Create a small searchable index from FAQs
  const index = useMemo(
    () =>
      faqs.map((f, i) => ({ id: i, text: `${f.q} ${f.a}`.toLowerCase(), q: f.q, a: f.a })),
    [faqs]
  );

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I’m your Afrimigrate assistant. Ask me about visas, jobs, pricing, or your profile. I’ll point you to the right place.",
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleAsk = () => {
    const text = input.trim();
    if (!text) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");

    // Lightweight matcher against FAQs
    const query = text.toLowerCase();
    const scored = index
      .map((item) => ({
        item,
        score: scoreMatch(item.text, query),
      }))
      .sort((a, b) => b.score - a.score);

    let reply: string;
    if (scored[0]?.score && scored[0].score > 0.3) {
      reply = `Q: ${scored[0].item.q}\n\n${scored[0].item.a}`;
    } else {
      reply =
        "I couldn’t find an exact answer, but here are quick links: \n• Visa: /visa\n• Jobs: /jobs\n• Profile: /profile\n• Addons: /addons\n• Pricing: /pricing";
    }

    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    }, 300);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          variant="brand"
          className="shadow-lg"
          aria-label="Open AI chat assistant"
        >
          <MessageSquare className="mr-2 h-4 w-4" /> Chat with AI
        </Button>
      )}

      {open && (
        <Card className="w-[90vw] max-w-sm h-[70vh] md:h-[60vh] flex flex-col shadow-xl border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Afrimigrate Assistant</CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              aria-label="Minimize chat"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto rounded-md border bg-background p-3 space-y-3"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role}>
                  {formatMessage(m.content)}
                </MessageBubble>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about visas, jobs, pricing…"
                aria-label="Ask the assistant"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAsk();
                }}
              />
              <Button onClick={handleAsk} aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Tip: Try “What documents do I need for Canada?” or “How do I upgrade?”
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Coming soon: Full AI answers. For now, I’ll match FAQs and share quick links.
            </div>

            <div className="mt-3 text-xs">
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/visa">Open Visa</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/jobs">Open Jobs</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/profile">Open Profile</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/addons">Open Addons</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MessageBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          "max-w-[85%] rounded-md border px-3 py-2 text-sm " +
          (isUser ? "bg-accent" : "bg-background")
        }
      >
        {children}
      </div>
    </div>
  );
}

function scoreMatch(text: string, query: string) {
  // Simple token overlap score
  const qTokens = query.split(/\s+/).filter(Boolean);
  if (qTokens.length === 0) return 0;
  let hits = 0;
  for (const t of qTokens) if (text.includes(t)) hits++;
  return hits / qTokens.length;
}

function formatMessage(content: string) {
  // Linkify internal routes in our fallback list using <Link>
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <Line key={i} text={line} />
      ))}
    </div>
  );
}

function Line({ text }: { text: string }) {
  // Replace routes like /visa, /jobs with Links
  const routePattern = /(^|\s)(\/(visa|jobs|profile|addons|pricing))(\s|$)/g;
  const parts: Array<string | { route: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = routePattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push({ route: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <p>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : (
          <Link key={i} to={p.route} className="underline hover:no-underline">
            {p.route}
          </Link>
        )
      )}
    </p>
  );
}
