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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lock, ExternalLink, Upload } from "lucide-react";

// -------------------- Mock Data --------------------
const VISA_DATA: Record<string, {
  country: string;
  visas: Array<{ type: string; eligibility: string[]; documents: string[]; processing: string }>;
}> = {
  Canada: {
    country: "Canada",
    visas: [
      { type: "Work (Express Entry)", eligibility: ["Skilled work experience", "Language test (IELTS/TEF)", "Proof of funds"], documents: ["Passport", "ECA (education)", "Language results"], processing: "6–8 months" },
      { type: "Study Permit", eligibility: ["Letter of acceptance", "Proof of funds", "Ties to home country"], documents: ["Passport", "LOA", "Bank statements"], processing: "8–12 weeks" },
      { type: "Visitor Visa", eligibility: ["Travel purpose", "Sufficient funds"], documents: ["Passport", "Itinerary", "Proof of funds"], processing: "3–8 weeks" },
    ],
  },
  "United Kingdom": {
    country: "United Kingdom",
    visas: [
      { type: "Skilled Worker", eligibility: ["Sponsor license employer", "English B1", "Salary threshold"], documents: ["Passport", "CoS", "English test"], processing: "3–8 weeks" },
      { type: "Student Visa", eligibility: ["CAS from university", "Funds", "English"], documents: ["Passport", "CAS", "Bank statements"], processing: "3–6 weeks" },
      { type: "Visitor Visa", eligibility: ["Travel purpose", "Funds"], documents: ["Passport", "Itinerary", "Bank statements"], processing: "3–6 weeks" },
    ],
  },
  "United States": {
    country: "United States",
    visas: [
      { type: "H-1B (Specialty Occupation)", eligibility: ["Bachelor's degree", "Employer sponsor"], documents: ["Passport", "LCA", "I-129"], processing: "3–6 months (varies)" },
      { type: "F-1 (Student)", eligibility: ["I-20 from school", "Funds"], documents: ["Passport", "I-20", "SEVIS fee"], processing: "3–8 weeks" },
      { type: "B-2 (Tourist)", eligibility: ["Travel purpose", "Funds"], documents: ["Passport", "Itinerary", "Funds"], processing: "2–8 weeks" },
    ],
  },
  Germany: {
    country: "Germany",
    visas: [
      { type: "Blue Card", eligibility: ["University degree", "Salary threshold"], documents: ["Passport", "Degree", "Contract"], processing: "6–12 weeks" },
      { type: "Job Seeker", eligibility: ["Recognized degree", "Funds"], documents: ["Passport", "CV", "Proof of funds"], processing: "6–12 weeks" },
      { type: "Schengen (Tourist)", eligibility: ["Travel purpose", "Funds"], documents: ["Passport", "Itinerary", "Insurance"], processing: "2–6 weeks" },
    ],
  },
};

// -------------------- Types & Helpers --------------------
const COUNTRIES = Object.keys(VISA_DATA);
const STATUSES = ["Draft", "Submitted", "In Review", "Approved", "Rejected"] as const;

type AppStatus = typeof STATUSES[number];

type VisaApplication = {
  id: string;
  country: string;
  visaType: string;
  applicantName: string;
  status: AppStatus;
  createdAt: string;
  updatedAt: string;
};

const APPS_KEY = "visa_applications";

function loadApps(): VisaApplication[] {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    return raw ? (JSON.parse(raw) as VisaApplication[]) : [];
  } catch {
    return [];
  }
}
function saveApps(apps: VisaApplication[]) {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

// -------------------- Component --------------------
export default function Visa() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"requirements" | "wizard">("requirements");

  // Requirements
  const [country, setCountry] = useState<string>(COUNTRIES[0] || "Canada");

  // Wizard state
  const [step, setStep] = useState(0);
  const steps = [
    "personal",
    "passport",
    "education",
    "work",
    "language",
    "documents",
    "payment",
    "results",
  ] as const;
  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    nationality: "",
    dob: "",
    passportNumber: "",
    passportCountry: "",
    passportIssue: "",
    passportExpiry: "",
    degree: "",
    institution: "",
    gradYear: "",
    yearsExp: "",
    jobTitle: "",
    industry: "",
    languageTest: "IELTS",
    languageScore: "",
    targetCountry: COUNTRIES[0] || "Canada",
  });

  // File uploads
  const [files, setFiles] = useState<File[]>([]);
  const MAX_MB = 5;
  const ALLOWED = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const next: File[] = [];
    const errors: string[] = [];
    Array.from(list).forEach((f) => {
      if (!ALLOWED.includes(f.type)) {
        errors.push(`${f.name}: unsupported type`);
      } else if (f.size > MAX_MB * 1024 * 1024) {
        errors.push(`${f.name}: exceeds ${MAX_MB}MB`);
      } else {
        next.push(f);
      }
    });
    if (errors.length) {
      toast({ title: "Some files were skipped", description: errors.join("; "), variant: "destructive" });
    }
    setFiles((prev) => [...prev, ...next]);
  }
  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Subscription gating (mock)
  const subscription: "Freemium" | "Premium" = (typeof window !== "undefined"
    ? ((localStorage.getItem("am_subscription") as "Freemium" | "Premium" | null) || "Freemium")
    : "Freemium");
  const gated = subscription !== "Premium";

  // Save application (local, placeholder for Supabase)
  const [apps, setApps] = useState<VisaApplication[]>(loadApps());
  function addApplication(recommendedVisa: string) {
    const app: VisaApplication = {
      id: crypto.randomUUID(),
      country: form.targetCountry,
      visaType: recommendedVisa,
      applicantName: form.name || "Applicant",
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = [app, ...apps];
    setApps(next);
    saveApps(next);
    toast({ title: "Application saved", description: "Tracking locally. Connect Supabase to sync to backend." });
  }
  function updateStatus(id: string, status: AppStatus) {
    const next = apps.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a));
    setApps(next);
    saveApps(next);
  }

  // Mock eligibility
  const eligibility = useMemo(() => {
    const score =
      (Number(form.yearsExp) >= 2 ? 2 : 0) +
      (Number(form.languageScore) >= 6 ? 2 : 0) +
      (form.degree ? 1 : 0) +
      (files.length ? 1 : 0);
    const level = score >= 5 ? "Strong" : score >= 3 ? "Medium" : "Low";
    const rec = (() => {
      const list = VISA_DATA[form.targetCountry]?.visas || [];
      if (score >= 5) return list.find((v) => /Work|Skilled|Blue Card/i.test(v.type))?.type || list[0]?.type || "Work";
      if (score >= 3) return list.find((v) => /Study/i.test(v.type))?.type || list[0]?.type || "Study";
      return list.find((v) => /Visitor|Schengen/i.test(v.type))?.type || list[0]?.type || "Visitor";
    })();
    return { level, rec };
  }, [form, files]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Visa Processing | Afrimigrate</title>
        <meta name="description" content="Visa processing requirements and AI wizard for immigrants. Check eligibility, upload documents, and track applications." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + "/visa" : "/visa"} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-6 md:py-10">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-display">Visa Processing</h1>
              <p className="text-sm text-muted-foreground">Requirements, AI Visa Wizard, and application tracking.</p>
            </div>
            <Badge variant="secondary">{subscription}</Badge>
          </header>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Tools</CardTitle>
              <CardDescription>Switch tabs to explore visa requirements or use the AI wizard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                <TabsList className="flex-wrap gap-2">
                  <TabsTrigger value="requirements">Visa Requirements</TabsTrigger>
                  <TabsTrigger value="wizard">AI Visa Wizard</TabsTrigger>
                </TabsList>

                {/* Requirements Tab */}
                <TabsContent value="requirements" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Destination Country</CardTitle>
                      <CardDescription>Select a country to view visa types and details.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-1">
                        <Label htmlFor="country">Country</Label>
                        <Select value={country} onValueChange={setCountry}>
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="text-xs text-muted-foreground mt-2">
                          API placeholders: IRCC (Canada), UKVI (UK), USCIS (US), BAMF (Germany)
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        {(VISA_DATA[country]?.visas || []).map((v) => (
                          <div key={v.type} className="border rounded-md p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="font-medium break-words">{v.type}</p>
                                <p className="text-xs text-muted-foreground">Processing time: {v.processing}</p>
                              </div>
                              <Badge variant="secondary" className="whitespace-nowrap">{VISA_DATA[country].country}</Badge>
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <div>
                                <p className="text-sm font-medium">Eligibility</p>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {v.eligibility.map((e, i) => (<li key={i} className="break-words">{e}</li>))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Required Documents</p>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {v.documents.map((d, i) => (<li key={i} className="break-words">{d}</li>))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Wizard Tab */}
                <TabsContent value="wizard" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">AI Visa Wizard</CardTitle>
                      <CardDescription>Answer steps to see eligibility and recommended visa types.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={progress} aria-label="Wizard progress" />
                      <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>

                      {/* Steps */}
                      {step === 0 && (
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input id="nationality" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="passportNumber">Passport Number</Label>
                            <Input id="passportNumber" value={form.passportNumber} onChange={(e) => setForm({ ...form, passportNumber: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="passportCountry">Passport Country</Label>
                            <Input id="passportCountry" value={form.passportCountry} onChange={(e) => setForm({ ...form, passportCountry: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="passportIssue">Issue Date</Label>
                            <Input id="passportIssue" type="date" value={form.passportIssue} onChange={(e) => setForm({ ...form, passportIssue: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="passportExpiry">Expiry Date</Label>
                            <Input id="passportExpiry" type="date" value={form.passportExpiry} onChange={(e) => setForm({ ...form, passportExpiry: e.target.value })} />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="degree">Highest Degree</Label>
                            <Input id="degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="gradYear">Graduation Year</Label>
                            <Input id="gradYear" type="number" value={form.gradYear} onChange={(e) => setForm({ ...form, gradYear: e.target.value })} />
                          </div>
                          <div className="grid gap-2 md:col-span-3">
                            <Label htmlFor="institution">Institution</Label>
                            <Input id="institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="grid gap-2">
                            <Label htmlFor="yearsExp">Years of Experience</Label>
                            <Input id="yearsExp" type="number" value={form.yearsExp} onChange={(e) => setForm({ ...form, yearsExp: e.target.value })} />
                          </div>
                          <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="jobTitle">Job Title / Industry</Label>
                            <Input id="jobTitle" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="e.g., Software Engineer (Tech)" />
                          </div>
                          <div className="grid gap-2 md:col-span-3">
                            <Label htmlFor="industry">Details (optional)</Label>
                            <Textarea id="industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Briefly describe your role and achievements." />
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="grid gap-2">
                            <Label>Language Test</Label>
                            <Select value={form.languageTest} onValueChange={(v) => setForm({ ...form, languageTest: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IELTS">IELTS</SelectItem>
                                <SelectItem value="TOEFL">TOEFL</SelectItem>
                                <SelectItem value="PTE">PTE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="languageScore">Overall Score</Label>
                            <Input id="languageScore" type="number" value={form.languageScore} onChange={(e) => setForm({ ...form, languageScore: e.target.value })} placeholder="e.g., 7" />
                          </div>
                          <div className="grid gap-2">
                            <Label>Target Country</Label>
                            <Select value={form.targetCountry} onValueChange={(v) => setForm({ ...form, targetCountry: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {step === 5 && (
                        <div className="space-y-3">
                          <div className="grid gap-2">
                            <Label htmlFor="docs">Upload Documents</Label>
                            <Input id="docs" type="file" multiple onChange={(e) => onFilesSelected(e.target.files)} aria-label="Upload supporting documents" />
                            <p className="text-xs text-muted-foreground">Allowed: PDF, DOC, DOCX, PNG, JPG up to {MAX_MB}MB each.</p>
                          </div>
                          <div className="grid gap-2">
                            {files.length === 0 ? (
                              <div className="text-sm text-muted-foreground">No files uploaded.</div>
                            ) : (
                              <ul className="text-sm divide-y rounded-md border">
                                {files.map((f, i) => (
                                  <li key={i} className="flex items-center justify-between gap-3 p-2">
                                    <span className="min-w-0 truncate" title={f.name}>{f.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground">{(f.size/1024/1024).toFixed(2)}MB</span>
                                      <Button variant="outline" size="sm" onClick={() => removeFile(i)}>Remove</Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <Alert>
                            <AlertTitle>Storage</AlertTitle>
                            <AlertDescription>
                              Files are held in memory for this demo. Connect Supabase Storage to upload securely.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}

                      {step === 6 && (
                        <div className="space-y-3">
                          <p className="text-sm">Payment placeholder. In production, process fees via a PCI-compliant provider.</p>
                          <div className="grid gap-3 md:grid-cols-3">
                            <div className="grid gap-2">
                              <Label>Cardholder Name</Label>
                              <Input disabled placeholder="John Doe" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Card Number</Label>
                              <Input disabled placeholder="4242 4242 4242 4242" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Expiry / CVC</Label>
                              <Input disabled placeholder="12/26 · 123" />
                            </div>
                          </div>
                          {gated && (
                            <Alert>
                              <AlertTitle>Premium feature</AlertTitle>
                              <AlertDescription className="flex items-center justify-between gap-2 flex-wrap">
                                Advanced assistance (auto-fill forms, personalized checklists) requires Premium.
                                <Button asChild size="sm"><a href="/#pricing">Upgrade</a></Button>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      {step === 7 && (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium">Eligibility Result</p>
                              <p className="text-sm">Overall likelihood: <strong>{eligibility.level}</strong></p>
                            </div>
                            <Badge variant="secondary">AI Preview</Badge>
                          </div>
                          <div className="border rounded-md p-4">
                            <p className="text-sm">Recommended visa type for {form.targetCountry}: <strong>{eligibility.rec}</strong></p>
                            <p className="text-xs text-muted-foreground mt-1">This is mock logic for MVP; integrate with official API rules later.</p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button onClick={() => addApplication(eligibility.rec)} className="inline-flex items-center gap-2"><Upload className="h-4 w-4" /> Save & Track</Button>
                            <Button variant="outline" onClick={() => setStep(0)}>Start Over</Button>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-2">
                        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" asChild>
                            <a href="#visa-wizard-help">Help <ExternalLink className="h-4 w-4 ml-1" /></a>
                          </Button>
                          {step < steps.length - 1 ? (
                            <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>Next</Button>
                          ) : (
                            <Button onClick={() => addApplication(eligibility.rec)}>Finish</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tracking */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Applications</CardTitle>
                      <CardDescription>Status is stored locally for now. Connect Supabase to sync.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {apps.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No applications yet. Complete the wizard to add one.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="text-left text-muted-foreground">
                              <tr>
                                <th className="py-2 pr-2">Applicant</th>
                                <th className="py-2 pr-2">Country</th>
                                <th className="py-2 pr-2">Visa Type</th>
                                <th className="py-2 pr-2">Status</th>
                                <th className="py-2 pr-2">Updated</th>
                              </tr>
                            </thead>
                            <tbody>
                              {apps.map((a) => (
                                <tr key={a.id} className="border-t">
                                  <td className="py-2 pr-2 break-words">{a.applicantName}</td>
                                  <td className="py-2 pr-2">{a.country}</td>
                                  <td className="py-2 pr-2 break-words">{a.visaType}</td>
                                  <td className="py-2 pr-2">
                                    <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v as AppStatus)}>
                                      <SelectTrigger className="h-8 w-[160px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="py-2 pr-2 text-xs text-muted-foreground">{new Date(a.updatedAt).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
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
