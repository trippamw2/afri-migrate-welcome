import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, FileText, Mic, ExternalLink, Lock } from "lucide-react";

export default function Skills() {
  // Mock subscription state (replace with real state when backend is connected)
  const subscription: "Freemium" | "Premium" = (typeof window !== "undefined"
    ? ((localStorage.getItem("am_subscription") as "Freemium" | "Premium" | null) || "Freemium")
    : "Freemium");
  const steps = ["assessment", "courses", "resume", "interview"] as const;
  const [tab, setTab] = useState<(typeof steps)[number]>("assessment");
  const stepIndex = steps.indexOf(tab);
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);

  // ------- Skills Assessment (mock) -------
  type Choice = { label: string; value: number };
  type Question = { id: string; prompt: string; choices: Choice[] };
  const questions: Question[] = [
    { id: "q1", prompt: "How comfortable are you with writing a resume tailored to a job?", choices: [
      { label: "Expert", value: 5 }, { label: "Intermediate", value: 3 }, { label: "Beginner", value: 1 }
    ]},
    { id: "q2", prompt: "Rate your interview preparedness (behavioral + technical).", choices: [
      { label: "Very prepared", value: 5 }, { label: "Somewhat prepared", value: 3 }, { label: "Not prepared", value: 1 }
    ]},
    { id: "q3", prompt: "English communication in professional settings.", choices: [
      { label: "Fluent", value: 5 }, { label: "Good", value: 3 }, { label: "Needs work", value: 1 }
    ]},
    { id: "q4", prompt: "Job search strategy knowledge (keywords, networking, ATS).", choices: [
      { label: "Strong", value: 5 }, { label: "Average", value: 3 }, { label: "Limited", value: 1 }
    ]},
    { id: "q5", prompt: "Do you know which roles match your immigration eligibility?", choices: [
      { label: "Yes", value: 5 }, { label: "Partly", value: 3 }, { label: "No", value: 1 }
    ]},
  ];
  const maxScore = questions.length * 5;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const percent = Math.round((totalScore / maxScore) * 100) || 0;

  const handleSelect = (qid: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  // ------- Courses (curated links) -------
  const courses = [
    { id: "c1", title: "Resume Writing: Get Your Dream Job", platform: "Coursera", url: "https://www.coursera.org" },
    { id: "c2", title: "Interview Skills Masterclass", platform: "Udemy", url: "https://www.udemy.com" },
    { id: "c3", title: "English for Career Development", platform: "Coursera", url: "https://www.coursera.org/learn/english-for-career-development" },
    { id: "c4", title: "LinkedIn Networking Essentials", platform: "LinkedIn Learning", url: "https://www.linkedin.com/learning" },
    { id: "c5", title: "ATS Keywords & Job Search Strategy", platform: "Udemy", url: "https://www.udemy.com" },
  ];

  // ------- Resume Builder (mock AI suggestions) -------
  const [resume, setResume] = useState({
    name: "",
    title: "",
    summary: "",
    skills: "",
    experience: "",
    target: "",
  });
  const resumeSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    if (resume.summary.trim().length < 120) suggestions.push("Expand your summary to 3-4 sentences and include 1-2 quantified achievements.");
    if (!resume.skills.includes(",")) suggestions.push("List at least 6-10 skills separated by commas, prioritizing job-specific keywords.");
    if (!/\d+%|\$|\d+\+/.test(resume.experience)) suggestions.push("Quantify impact in experience (e.g., increased efficiency by 15%, handled $200k budget).");
    if (resume.target && !resume.summary.toLowerCase().includes(resume.target.toLowerCase())) suggestions.push("Reference your target role in the summary to improve ATS match.");
    if (!resume.title) suggestions.push("Add a clear professional title (e.g., Frontend Developer | React | TypeScript).");
    if (suggestions.length === 0) suggestions.push("Great foundation! Consider tailoring bullet points to each application.");
    return suggestions;
  }, [resume]);

  // ------- Mock Interview (Q&A + feedback placeholders) -------
  const interviewQs = [
    { id: "i1", q: "Tell me about yourself.", rubric: "Structure your story: background, key achievements, and why this role." },
    { id: "i2", q: "Describe a challenging project and your impact.", rubric: "Use STAR: Situation, Task, Action, Result with metrics." },
    { id: "i3", q: "Why should we sponsor your visa or hire you?", rubric: "Highlight unique skills, adaptability, and relocation readiness." },
  ];
  const [iqIndex, setIqIndex] = useState(0);
  const [iqAnswer, setIqAnswer] = useState("");

  const gated = subscription !== "Premium";

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Skills & Job Readiness | Afrimigrate</title>
        <meta name="description" content="AI skills assessment, resume builder, courses, and mock interviews to boost immigrant job readiness." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/skills" : "/skills"} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-6 md:py-10">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-display">Skills & Job Readiness</h1>
              <p className="text-sm text-muted-foreground">Follow the steps to boost your profile and confidence.</p>
            </div>
            <Badge variant="secondary" aria-label={`Subscription: ${subscription}`}>{subscription}</Badge>
          </header>

          <div className="mt-4">
            <Progress value={progress} aria-label="Module progress" />
            <p className="text-xs text-muted-foreground mt-1">Step {stepIndex + 1} of {steps.length}</p>
          </div>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Journey</CardTitle>
              <CardDescription className="break-words">Move through each module. Your progress updates automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                <TabsList className="flex-wrap gap-2">
                  <TabsTrigger value="assessment" className="flex items-center gap-2"><Brain className="h-4 w-4" /> Assessment</TabsTrigger>
                  <TabsTrigger value="courses" className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Courses</TabsTrigger>
                  <TabsTrigger value="resume" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Resume</TabsTrigger>
                  <TabsTrigger value="interview" className="flex items-center gap-2"><Mic className="h-4 w-4" /> Interview</TabsTrigger>
                </TabsList>

                {/* Assessment */}
                <TabsContent value="assessment" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Skills Assessment (Mock)</CardTitle>
                      <CardDescription>Answer a few questions to get a readiness score.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {questions.map((q) => (
                        <div key={q.id} className="space-y-2">
                          <p className="font-medium break-words">{q.prompt}</p>
                          <div className="flex flex-wrap gap-2">
                            {q.choices.map((c) => (
                              <Button
                                key={c.label}
                                type="button"
                                variant={answers[q.id] === c.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleSelect(q.id, c.value)}
                              >
                                {c.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <Alert>
                        <AlertTitle>Your Readiness Score</AlertTitle>
                        <AlertDescription>
                          {Object.keys(answers).length < questions.length ? (
                            <span className="text-muted-foreground">Answer remaining questions to see your score.</span>
                          ) : (
                            <span><strong>{percent}%</strong> overall. Focus on the modules below to improve weak areas.</span>
                          )}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Courses */}
                <TabsContent value="courses" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommended Courses</CardTitle>
                      <CardDescription>Curated resources to upskill quickly.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      {courses.map((c) => (
                        <div key={c.id} className="border rounded-md p-4 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium break-words">{c.title}</p>
                            <p className="text-xs text-muted-foreground break-words">{c.platform}</p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <a href={c.url} target="_blank" rel="noreferrer noopener" aria-label={`Open ${c.title} on ${c.platform}`}>
                              Open <ExternalLink className="h-3.5 w-3.5 ml-1" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Resume */}
                <TabsContent value="resume" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI-powered Resume Builder</CardTitle>
                      <CardDescription>Write your resume and get smart suggestions.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={resume.name} onChange={(e) => setResume({ ...resume, name: e.target.value })} placeholder="e.g., Ada Lovelace" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="title">Professional Title</Label>
                          <Input id="title" value={resume.title} onChange={(e) => setResume({ ...resume, title: e.target.value })} placeholder="e.g., Frontend Developer | React | TypeScript" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="summary">Summary</Label>
                          <Textarea id="summary" value={resume.summary} onChange={(e) => setResume({ ...resume, summary: e.target.value })} placeholder="3-4 sentences that highlight your top skills and impact." />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="skills">Skills (comma separated)</Label>
                          <Input id="skills" value={resume.skills} onChange={(e) => setResume({ ...resume, skills: e.target.value })} placeholder="React, TypeScript, Node.js, ..." />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="experience">Experience Highlights</Label>
                          <Textarea id="experience" value={resume.experience} onChange={(e) => setResume({ ...resume, experience: e.target.value })} placeholder="List 3-5 bullet points with metrics." />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="target">Target Role</Label>
                          <Input id="target" value={resume.target} onChange={(e) => setResume({ ...resume, target: e.target.value })} placeholder="e.g., Software Engineer (Visa-friendly)" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">AI Suggestions</p>
                          {gated && (
                            <span className="inline-flex items-center text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5 mr-1" /> Limited on Freemium</span>
                          )}
                        </div>
                        <ul className="list-disc pl-5 space-y-2">
                          {(gated ? resumeSuggestions.slice(0, 2) : resumeSuggestions).map((s, i) => (
                            <li key={i} className="break-words">{s}</li>
                          ))}
                        </ul>
                        {gated && (
                          <Alert>
                            <AlertTitle>Unlock full access</AlertTitle>
                            <AlertDescription className="flex items-center justify-between gap-2 flex-wrap">
                              Get complete AI rewrites, keyword optimization, and export.
                              <Button asChild size="sm">
                                <a href="/#pricing">Upgrade</a>
                              </Button>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Interview */}
                <TabsContent value="interview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mock Interview Simulator</CardTitle>
                      <CardDescription>Practice answers and get AI feedback placeholders.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-medium break-words">Question {iqIndex + 1} of {interviewQs.length}</p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setIqIndex((i) => Math.max(0, i - 1))} disabled={iqIndex === 0}>Prev</Button>
                          <Button variant="outline" size="sm" onClick={() => setIqIndex((i) => Math.min(interviewQs.length - 1, i + 1))} disabled={iqIndex === interviewQs.length - 1}>Next</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="break-words">{interviewQs[iqIndex].q}</p>
                        <Textarea value={iqAnswer} onChange={(e) => setIqAnswer(e.target.value)} placeholder="Write your answer using STAR format..." />
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium">AI Feedback</p>
                        {gated ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Preview: Focus on structure and add metrics. Use action verbs and keep answers 1-2 minutes long.</p>
                            <Alert>
                              <AlertTitle>Premium feature</AlertTitle>
                              <AlertDescription className="flex items-center justify-between gap-2 flex-wrap">
                                Get detailed feedback with scoring, filler word detection, and improvement tips.
                                <Button asChild size="sm"><a href="/#pricing">Upgrade</a></Button>
                              </AlertDescription>
                            </Alert>
                          </div>
                        ) : (
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Structure: Clear STAR flow (3/5). Add more context to the Situation.</li>
                            <li>Impact: Quantify the Result with metrics (e.g., 20% reduction in errors).</li>
                            <li>Delivery: Avoid passive voice; use confident, concise statements.</li>
                          </ul>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
