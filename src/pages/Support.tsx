import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Users, Star, Link as LinkIcon, Crown } from "lucide-react";

const isPremium = () => localStorage.getItem("am_subscription") === "premium";

// Chat types
type ChatMsg = { id: string; role: "user" | "ai"; text: string; ts: number };
const CHAT_KEY = "am_support_chat";

// Forum types
type Thread = {
  id: string;
  title: string;
  author: string;
  createdAt: number;
  posts: { id: string; author: string; text: string; ts: number }[];
};
const FORUM_KEY = "am_forum_threads";

const SupportPage: React.FC = () => {
  const premium = isPremium();

  // SEO structured data (resources list)
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      { "@type": "CreativeWork", name: "IRCC Immigration Resources", url: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
      { "@type": "CreativeWork", name: "UKVI Visa Guidance", url: "https://www.gov.uk/browse/visas-immigration" },
      { "@type": "CreativeWork", name: "Australia Home Affairs", url: "https://immi.homeaffairs.gov.au/" },
      { "@type": "CreativeWork", name: "EU Immigration Portal", url: "https://migration.europa.eu/" },
    ],
  }), []);

  return (
    <>
      <Helmet>
        <title>Support & Community | Afrimigrate</title>
        <meta name="description" content="Get help via AI chatbot, join community threads, read success stories, and explore curated resources. Premium members access exclusive groups & webinars." />
        <link rel="canonical" href={`${window.location.origin}/support`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Support & Community</h1>
          <p className="text-muted-foreground mt-2">Ask questions, connect with others, and learn from real success stories.</p>
          <nav className="mt-4 flex flex-wrap gap-2" aria-label="Quick links">
            <Button asChild variant="outline" size="sm"><Link to="/skills">Go to Skills</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/visa">Go to Visa</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/addons">Go to Addons</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/profile">Go to Profile</Link></Button>
          </nav>
        </header>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Chatbot</TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2"><Users className="h-4 w-4" /> Community</TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2"><Star className="h-4 w-4" /> Success Stories</TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Resources</TabsTrigger>
          </TabsList>

          {/* Chatbot */}
          <TabsContent value="chat" className="mt-6">
            <ChatbotCard />
          </TabsContent>

          {/* Community */}
          <TabsContent value="community" className="mt-6">
            <CommunitySection />
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="stories" className="mt-6">
            <StoriesSection />
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources" className="mt-6">
            <ResourcesSection />
          </TabsContent>
        </Tabs>

        <section className="mt-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5" /> Premium Perks</CardTitle>
                <CardDescription>Exclusive community groups and members-only webinars.</CardDescription>
              </div>
              {!premium && <Badge>Premium</Badge>}
            </CardHeader>
            <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">Unlock access to private regional groups, expert AMAs, and monthly webinars with Q&A.</p>
              {premium ? (
                <div className="flex gap-2">
                  <Button onClick={() => toast({ title: "Joined", description: "You have access to exclusive groups." })}>Join Private Group</Button>
                  <Button variant="outline" onClick={() => toast({ title: "Registered", description: "You are registered for the next webinar." })}>Register Webinar</Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => toast({ title: "Upgrade to Premium", description: "Connect Stripe to enable premium checkout." })}>Upgrade</Button>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

// Chatbot component (mock AI replies)
const ChatbotCard: React.FC = () => {
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      return raw ? JSON.parse(raw) : [
        { id: crypto.randomUUID(), role: "ai", text: "Hi! I'm your migration assistant. Ask me about visas, documents, or next steps.", ts: Date.now() },
      ];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const msg: ChatMsg = { id: crypto.randomUUID(), role: "user", text, ts: Date.now() };
    setMessages((m) => [...m, msg]);
    setInput("");
    // Mock AI response
    setTimeout(() => {
      const replyText = getMockAnswer(text);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: replyText, ts: Date.now() }]);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Chatbot</CardTitle>
        <CardDescription>Get quick answers. Placeholder only — connect Perplexity/OpenAI via Supabase for real AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={listRef} className="h-[320px] w-full overflow-y-auto rounded-md border p-3 bg-muted/30">
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="flex max-w-[85%] flex-col gap-1 whitespace-pre-wrap text-sm md:max-w-[70%]" aria-live="polite">
                <div className={`${m.role === "user" ? "self-end" : "self-start"} px-3 py-2 rounded-md border bg-background`}>{m.text}</div>
                <span className="text-[10px] text-muted-foreground {m.role === 'user' ? 'self-end' : 'self-start'}">{new Date(m.ts).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={send} className="mt-3 flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." aria-label="Ask a question" />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  );
};

function getMockAnswer(question: string) {
  const q = question.toLowerCase();
  if (q.includes("processing") || q.includes("time")) return "Processing times vary by visa type and country. Check official websites (e.g., IRCC/UKVI) and apply early.";
  if (q.includes("document") || q.includes("docs")) return "Common documents include passport, photos, proof of funds, travel history, and purpose letters. See our Visa page for details.";
  if (q.includes("premium")) return "Premium includes exclusive groups, webinars, and priority support.";
  return "Thanks! I'm a placeholder AI. For precise info, consult official immigration portals listed in Resources.";
}

// Community Section
const CommunitySection: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>(() => {
    try {
      const raw = localStorage.getItem(FORUM_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    const seed: Thread[] = [
      { id: crypto.randomUUID(), title: "Canada Study Permit timeline 2025", author: "Ada", createdAt: Date.now() - 86400000, posts: [ { id: crypto.randomUUID(), author: "Ada", text: "Submitted in May, biometrics in June.", ts: Date.now() - 86300000 } ] },
      { id: crypto.randomUUID(), title: "UK Skilled Worker visa docs checklist", author: "Kwame", createdAt: Date.now() - 43200000, posts: [ { id: crypto.randomUUID(), author: "Kwame", text: "Employer CoS, TB test, funds.", ts: Date.now() - 43100000 } ] },
    ];
    return seed;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    localStorage.setItem(FORUM_KEY, JSON.stringify(threads));
  }, [threads]);

  const selected = threads.find((t) => t.id === selectedId) || threads[0];

  const addThread = () => {
    const title = newTitle.trim();
    if (!title) return toast({ title: "Enter a topic title", variant: "destructive" });
    const t: Thread = { id: crypto.randomUUID(), title, author: "You", createdAt: Date.now(), posts: [] };
    setThreads([t, ...threads]);
    setNewTitle("");
  };

  const addPost = () => {
    const text = newPost.trim();
    if (!text) return toast({ title: "Write a post message", variant: "destructive" });
    setThreads((prev) => prev.map((t) => t.id === selected.id ? { ...t, posts: [...t.posts, { id: crypto.randomUUID(), author: "You", text, ts: Date.now() }] } : t));
    setNewPost("");
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Threads</CardTitle>
          <CardDescription>Share experiences and tips.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Start a topic" />
            <Button onClick={addThread}>Post</Button>
          </div>
          <ul className="mt-4 space-y-2">
            {threads.map((t) => (
              <li key={t.id}>
                <button className={`w-full text-left rounded-md border p-2 hover:bg-muted ${selected?.id === t.id ? 'bg-muted/60' : ''}`} onClick={() => setSelectedId(t.id)}>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.posts.length} posts • by {t.author}</div>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{selected?.title || "Select a thread"}</CardTitle>
          <CardDescription>Join the discussion.</CardDescription>
        </CardHeader>
        <CardContent>
          {!selected ? (
            <p className="text-sm text-muted-foreground">Choose a thread on the left.</p>
          ) : (
            <>
              <ul className="space-y-3">
                {selected.posts.map((p) => (
                  <li key={p.id} className="rounded-md border p-3">
                    <div className="text-sm whitespace-pre-wrap">{p.text}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">by {p.author} • {new Date(p.ts).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Write a reply..." />
                <Button onClick={addPost}>Send</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Success stories grid
const StoriesSection: React.FC = () => {
  const stories = [
    { name: "Aisha", country: "UK", text: "Got Skilled Worker visa after Skills assessment and tailored resume." },
    { name: "Samuel", country: "Canada", text: "Study permit approved in 5 weeks with complete docs and guidance." },
    { name: "Lerato", country: "Australia", text: "PR pathway clearer after consultation and language upgrade." },
  ];
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {stories.map((s, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-xl">{s.name} • {s.country}</CardTitle>
            <CardDescription>Real journeys from our community</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">“{s.text}”</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

// Resources list
const ResourcesSection: React.FC = () => {
  const links = [
    { label: "IRCC (Canada) Immigration", href: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
    { label: "UKVI Visas & Immigration", href: "https://www.gov.uk/browse/visas-immigration" },
    { label: "Australia Home Affairs", href: "https://immi.homeaffairs.gov.au/" },
    { label: "EU Immigration Portal", href: "https://migration.europa.eu/" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Curated Resources</CardTitle>
        <CardDescription>Official immigration portals and trusted guides.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SupportPage;
