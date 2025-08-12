import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/lib/auth";
import { ExternalLink, BadgeCheck, Lock, Loader2, Filter } from "lucide-react";
import { MobileCard } from "@/components/ui/mobile-card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { usePreferences } from "@/context/PreferencesContext";

// Mock job data (visaSponsored + premium gating + source placeholders)
// Later: Replace with merged results from Job Bank Canada, USAJobs, Adzuna, EURES
export type Job = {
  id: string;
  title: string;
  employer: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  skills: string[];
  visaSponsored: boolean;
  url: string;
  premium?: boolean; // Premium-only listing
};

const MOCK_JOBS: Job[] = [
  { id: "1", title: "Software Engineer", employer: "GlobalTech", location: "Toronto, CA", type: "Full-time", skills: ["react", "typescript"], visaSponsored: true, url: "https://example.com/job/1" },
  { id: "2", title: "Data Analyst", employer: "HealthPlus", location: "Vancouver, CA", type: "Contract", skills: ["sql", "python"], visaSponsored: false, url: "https://example.com/job/2" },
  { id: "3", title: "Frontend Developer", employer: "FinServe", location: "New York, US", type: "Full-time", skills: ["react", "tailwind"], visaSponsored: true, url: "https://example.com/job/3", premium: true },
  { id: "4", title: "Cloud Engineer", employer: "SkyOps", location: "Austin, US", type: "Full-time", skills: ["aws", "terraform"], visaSponsored: false, url: "https://example.com/job/4" },
  { id: "5", title: "QA Engineer", employer: "Medware", location: "Berlin, DE", type: "Part-time", skills: ["cypress", "testing"], visaSponsored: true, url: "https://example.com/job/5" },
  { id: "6", title: "Backend Developer", employer: "Shoply", location: "Remote", type: "Full-time", skills: ["node", "postgres"], visaSponsored: false, url: "https://example.com/job/6" },
  { id: "7", title: "ML Engineer", employer: "VisionAI", location: "London, UK", type: "Full-time", skills: ["python", "pytorch"], visaSponsored: true, url: "https://example.com/job/7", premium: true },
  { id: "8", title: "DevOps Engineer", employer: "BuildOps", location: "Dublin, IE", type: "Contract", skills: ["kubernetes", "ci/cd"], visaSponsored: false, url: "https://example.com/job/8" },
];

export default function Jobs() {
  const user = getUser();
  const isPremium = false; // TODO: derive from real subscription state
  const { toast } = useToast();
  const { destination, destinations } = usePreferences();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string>("");
  const [skills, setSkills] = useState("");
  const [tab, setTab] = useState<"visa" | "nonVisa">("visa");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loadingNext, setLoadingNext] = useState(false);

  // Filter logic
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const jt = jobType as Job["type"] | "";
    const skillList = skills
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let list = MOCK_JOBS.filter((j) => (tab === "visa" ? j.visaSponsored : !j.visaSponsored));

    if (q) list = list.filter((j) => j.title.toLowerCase().includes(q) || j.employer.toLowerCase().includes(q));
    if (loc) list = list.filter((j) => j.location.toLowerCase().includes(loc));
    if (jt) list = list.filter((j) => j.type === jt);
    if (skillList.length)
      list = list.filter((j) => skillList.every((s) => j.skills.join(" ").toLowerCase().includes(s)));

    // Global destination preference filter
    if (destination) {
      const destMeta = destinations.find(d => d.code === destination);
      const synonyms = new Set<string>();
      if (destMeta) {
        synonyms.add(destMeta.name.toLowerCase());
        synonyms.add(destMeta.code.toLowerCase());
        // common alternates
        if (destMeta.code === "UK") synonyms.add("united kingdom");
        if (destMeta.code === "US") synonyms.add("united states");
      }
      list = list.filter(j => {
        const locLower = j.location.toLowerCase();
        for (const s of synonyms) { if (s && locLower.includes(s)) return true; }
        return synonyms.size === 0 ? true : false;
      });
    }

    return list;
  }, [query, location, jobType, skills, tab, destination, destinations]);

  const paged = results.slice(0, page * pageSize);
  const hasMore = results.length > paged.length;

  // Mock "AI" recommendations: score by skill overlap and visa tab preference
  const recommendations = useMemo(() => {
    const skillSet = new Set(
      skills
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );

    const scored = MOCK_JOBS.map((j) => {
      const overlap = j.skills.reduce((acc, sk) => acc + (skillSet.has(sk) ? 1 : 0), 0);
      const visaScore = tab === "visa" ? (j.visaSponsored ? 1 : 0) : j.visaSponsored ? 0 : 1;
      return { job: j, score: overlap * 2 + visaScore };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.job);

    return scored;
  }, [skills, tab]);

  function handleSave(job: Job) {
    // Backend storage required.
    // To enable real saving, connect Supabase via Lovable's native integration.
    try {
      const raw = localStorage.getItem("saved_jobs");
      const current: Job[] = raw ? JSON.parse(raw) : [];
      if (!current.find((j) => j.id === job.id)) {
        current.push(job);
        localStorage.setItem("saved_jobs", JSON.stringify(current));
      }
      toast({ title: "Saved", description: "Job saved locally. Connect Supabase to persist in backend." });
    } catch {
      toast({ title: "Error", description: "Could not save the job.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Immigrant Job Search | Afrimigrate</title>
        <meta name="description" content="Find immigrant-friendly jobs with visa sponsorship filters and tailored recommendations." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/jobs" : "/jobs"} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-6 md:py-10">
          <header className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl">Job Search for Immigrants</h1>
            <p className="text-muted-foreground">Visa-aware filters, clear listings, and smart suggestions.</p>
          </header>

          {/* Quick Job Search trigger (modal) */}
          <div className="mb-4">
            <MobileCard>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" aria-haspopup="dialog" aria-controls="job-search-dialog" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" /> Job Search
                  </Button>
                </DialogTrigger>
                <DialogContent id="job-search-dialog" aria-label="Refine job search">
                  <DialogHeader>
                    <DialogTitle>Refine Job Search</DialogTitle>
                    <DialogDescription>Adjust filters and apply to update results.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Input
                      placeholder="Search by title or employer"
                      value={query}
                      onChange={(e) => {
                        setPage(1);
                        setQuery(e.target.value);
                      }}
                      aria-label="Search"
                    />
                    <Input
                      placeholder="Location (e.g., Toronto, Remote)"
                      value={location}
                      onChange={(e) => {
                        setPage(1);
                        setLocation(e.target.value);
                      }}
                      aria-label="Location"
                    />
                    <Select value={jobType} onValueChange={(v) => { setPage(1); setJobType(v); }}>
                      <SelectTrigger aria-label="Job Type">
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Required skills (comma-separated)"
                      value={skills}
                      onChange={(e) => { setPage(1); setSkills(e.target.value); }}
                      aria-label="Required skills"
                    />
                  </div>

                  <div className="mt-4">
                    <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                      <TabsList className="flex-wrap">
                        <TabsTrigger value="visa">Visa-Sponsored Jobs</TabsTrigger>
                        <TabsTrigger value="nonVisa">Non Visa-Sponsored Jobs</TabsTrigger>
                      </TabsList>
                      <TabsContent value="visa" />
                      <TabsContent value="nonVisa" />
                    </Tabs>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </MobileCard>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  placeholder="Search by title or employer"
                  value={query}
                  onChange={(e) => {
                    setPage(1);
                    setQuery(e.target.value);
                  }}
                  aria-label="Search"
                />
                <Input
                  placeholder="Location (e.g., Toronto, Remote)"
                  value={location}
                  onChange={(e) => {
                    setPage(1);
                    setLocation(e.target.value);
                  }}
                  aria-label="Location"
                />
                <Select value={jobType} onValueChange={(v) => { setPage(1); setJobType(v); }}>
                  <SelectTrigger aria-label="Job Type">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Required skills (comma-separated)"
                  value={skills}
                  onChange={(e) => { setPage(1); setSkills(e.target.value); }}
                  aria-label="Required skills"
                />
              </div>

              <div className="mt-4">
                <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                  <TabsList className="flex-wrap">
                    <TabsTrigger value="visa">Visa-Sponsored Jobs</TabsTrigger>
                    <TabsTrigger value="nonVisa">Non Visa-Sponsored Jobs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="visa" />
                  <TabsContent value="nonVisa" />
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-sm text-muted-foreground mb-2">{results.length} jobs found</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {paged.map((job) => (
                  <JobCard key={job.id} job={job} isPremiumUser={isPremium} onSave={() => handleSave(job)} />
                ))}
              </div>
              {paged.length === 0 && (
                <Card className="mt-4">
                  <CardContent className="py-8 text-center text-muted-foreground">No jobs match your filters.</CardContent>
                </Card>
              )}
              {hasMore && (
                <div className="mt-4" aria-live="polite">
                  <MobileCard className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setLoadingNext(true);
                        window.setTimeout(() => {
                          setPage((p) => p + 1);
                          setLoadingNext(false);
                        }, 400);
                      }}
                      disabled={loadingNext}
                      aria-label="Next page of jobs"
                      aria-busy={loadingNext}
                    >
                      {loadingNext ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Loading
                        </>
                      ) : (
                        <>Next</>
                      )}
                    </Button>
                  </MobileCard>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <aside className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended</CardTitle>
                  <CardDescription>Based on your skills and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendations.map((job) => (
                    <div key={job.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="font-medium text-sm break-words">{job.title}</p>
                          <p className="text-xs text-muted-foreground break-words">{job.employer}</p>
                        </div>
                        {job.visaSponsored ? (
                          <Badge className="whitespace-nowrap"><BadgeCheck className="h-3 w-3 mr-1" /> Visa</Badge>
                        ) : (
                          <Badge variant="secondary" className="whitespace-nowrap">No Visa</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>Placeholders for APIs</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>• Job Bank Canada</p>
                  <p>• USAJobs</p>
                  <p>• Adzuna</p>
                  <p>• EURES</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">Integrate via Supabase Edge Functions.</p>
                </CardFooter>
              </Card>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function JobCard({ job, isPremiumUser, onSave }: { job: Job; isPremiumUser: boolean; onSave: () => void }) {
  const gated = job.premium && !isPremiumUser;

  return (
    <Card className="relative overflow-hidden">
      {gated && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1 text-sm">
              <Lock className="h-4 w-4" /> Premium Only
            </div>
            <Button asChild size="sm" variant="brand">
              <a href="/#pricing">Upgrade</a>
            </Button>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight break-words">{job.title}</CardTitle>
            <CardDescription className="break-words">{job.employer} • {job.location}</CardDescription>
          </div>
          {job.visaSponsored ? (
            <Badge className="self-start"><BadgeCheck className="h-3 w-3 mr-1" /> Visa</Badge>
          ) : (
            <Badge variant="secondary" className="self-start">No Visa</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((s) => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">{job.type}</div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onSave} disabled={gated}>Save</Button>
          <Button asChild size="sm" disabled={gated}>
            <a href={job.url} target="_blank" rel="noreferrer noopener" aria-label={`Apply to ${job.title}`}>
              Apply <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
