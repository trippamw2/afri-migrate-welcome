import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Calendar, FileText, Headset, Languages, ShieldCheck, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

// Types
interface BaseRequest {
  id: string;
  type: "document" | "consultation" | "language" | "support" | "referral";
  title: string;
  priceCents?: number; // optional if price varies
  status: "pending" | "in_progress" | "completed" | "cancelled" | "payment_pending";
  createdAt: string;
}

interface DocumentRequest extends BaseRequest {
  type: "document";
  documentType: string;
  description?: string;
  files?: { name: string; size: number }[];
}

interface ConsultationRequest extends BaseRequest {
  type: "consultation";
  datetime: string;
  durationMinutes: number;
}

interface LanguagePackageRequest extends BaseRequest {
  type: "language";
  packageName: string;
  level: string;
}

interface SupportRequest extends BaseRequest {
  type: "support";
  channel: "priority_chat" | "callback";
}

interface ReferralRequest extends BaseRequest {
  type: "referral";
  provider: "insurance" | "financial";
}

type ServiceRequest =
  | DocumentRequest
  | ConsultationRequest
  | LanguagePackageRequest
  | SupportRequest
  | ReferralRequest;

const STORAGE_KEY = "am_service_requests";
const isPremium = () => localStorage.getItem("am_subscription") === "premium";

function useServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRequests(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to parse service requests", e);
    }
  }, []);

  const save = (next: ServiceRequest[]) => {
    setRequests(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const add = (req: ServiceRequest) => save([req, ...requests]);

  const updateStatus = (id: string, status: ServiceRequest["status"]) => {
    const next = requests.map((r) => (r.id === id ? { ...r, status } : r));
    save(next);
  };

  return { requests, add, updateStatus };
}

const currency = (cents?: number) =>
  typeof cents === "number" ? (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" }) : "Contact";

const Addons: React.FC = () => {
  const { requests, add } = useServiceRequests();
  const premium = isPremium();

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        name: "Document Preparation Services",
        description: "Visa letters, reference letters prepared by experts.",
        offers: { "@type": "Offer", priceCurrency: "USD", price: "49.00" },
      },
      {
        "@type": "Service",
        name: "Expert Migration Assistance",
        description: "Consultations with certified migration agents.",
        offers: { "@type": "Offer", priceCurrency: "USD", price: "99.00" },
      },
      {
        "@type": "Service",
        name: "Premium Support",
        description: "Priority AI chatbot and human support.",
        offers: { "@type": "Offer", priceCurrency: "USD", price: "19.00" },
      },
      {
        "@type": "Service",
        name: "Language Training Packages",
        description: "Tailored language training for exams and interviews.",
        offers: { "@type": "Offer", priceCurrency: "USD", price: "59.00" },
      },
      {
        "@type": "Service",
        name: "Insurance and Financial Services Referrals",
        description: "Get connected to trusted providers.",
        offers: { "@type": "Offer", priceCurrency: "USD", price: "0.00" },
      },
    ],
  }), []);

  // Payment stubs — replace with Stripe or other gateway later
  const startPayment = async (amountCents: number, label: string) => {
    toast({ title: "Payment not configured", description: `Attempted to start payment for ${label} (${currency(amountCents)}). Configure Stripe/Supabase to proceed.`, variant: "default" });
    // Placeholder: window.open(url, '_blank') once edge functions are ready
  };

  return (
    <>
      <Helmet>
        <title>Addon Services Marketplace | Afrimigrate</title>
        <meta name="description" content="Order document prep, expert migration help, premium support, language training, and referrals. Some services require Premium subscription." />
        <link rel="canonical" href={`${window.location.origin}/addons`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="container mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Addon Services Marketplace</h1>
          <p className="text-muted-foreground mt-2">Enhance your migration journey with professional services. Premium-only items are marked accordingly.</p>
        </header>

        <Tabs defaultValue="services" className="w-full">
          <TabsList aria-label="Addon services navigation">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {/* Document Preparation */}
              <ServiceCard
                icon={<FileText className="h-6 w-6" aria-hidden />}
                title="Document Preparation"
                description="Visa letters, reference letters, and more prepared by experts."
                priceCents={4900}
                premiumOnly={false}
              >
                <DocumentOrderDialog
                  onCreate={async (payload) => {
                    const id = crypto.randomUUID();
                    const req: DocumentRequest = {
                      id,
                      type: "document",
                      title: `Document: ${payload.documentType}`,
                      documentType: payload.documentType,
                      description: payload.description,
                      files: payload.files?.map((f) => ({ name: f.name, size: f.size })),
                      priceCents: 4900,
                      status: "payment_pending",
                      createdAt: new Date().toISOString(),
                    };
                    add(req);
                    await startPayment(4900, req.title);
                  }}
                />
              </ServiceCard>

              {/* Migration Assistance */}
              <ServiceCard
                icon={<ShieldCheck className="h-6 w-6" aria-hidden />}
                title="Expert Migration Assistance"
                description="Book consultations with certified migration agents."
                priceCents={9900}
                premiumOnly={false}
              >
                <ConsultationDialog
                  onCreate={async (payload) => {
                    const id = crypto.randomUUID();
                    const req: ConsultationRequest = {
                      id,
                      type: "consultation",
                      title: `Consultation (${payload.duration} mins)`,
                      datetime: payload.datetime,
                      durationMinutes: payload.duration,
                      priceCents: 9900,
                      status: "payment_pending",
                      createdAt: new Date().toISOString(),
                    };
                    add(req);
                    await startPayment(9900, req.title);
                  }}
                />
              </ServiceCard>

              {/* Premium Support */}
              <ServiceCard
                icon={<Headset className="h-6 w-6" aria-hidden />}
                title="Premium Support"
                description="Priority AI chatbot and human support for faster resolutions."
                priceCents={1900}
                premiumOnly
              >
                {premium ? (
                  <div className="flex gap-2">
                    <Button onClick={() => toast({ title: "Priority chat", description: "Chat placeholder — connect your provider." })}>Start Chat</Button>
                    <Button variant="outline" onClick={() => toast({ title: "Request submitted", description: "A specialist will call you back soon." })}>Request Callback</Button>
                  </div>
                ) : (
                  <UpgradeHint />
                )}
              </ServiceCard>

              {/* Language Training */}
              <ServiceCard
                icon={<Languages className="h-6 w-6" aria-hidden />}
                title="Language Training Packages"
                description="Tailored training to improve your IELTS/TOEFL or interview skills."
                priceCents={5900}
                premiumOnly={false}
              >
                <LanguageEnroll onCreate={async (pkg) => {
                  const id = crypto.randomUUID();
                  const req: LanguagePackageRequest = {
                    id,
                    type: "language",
                    title: `Language Package: ${pkg.packageName}`,
                    packageName: pkg.packageName,
                    level: pkg.level,
                    priceCents: 5900,
                    status: "payment_pending",
                    createdAt: new Date().toISOString(),
                  };
                  add(req);
                  await startPayment(5900, req.title);
                }} />
              </ServiceCard>

              {/* Referrals */}
              <ServiceCard
                icon={<CreditCard className="h-6 w-6" aria-hidden />}
                title="Insurance & Financial Referrals"
                description="Get connected to trusted providers for your journey."
                priceCents={0}
                premiumOnly={false}
              >
                <ReferralForm onCreate={(provider) => {
                  const id = crypto.randomUUID();
                  const req: ReferralRequest = {
                    id,
                    type: "referral",
                    title: provider === "insurance" ? "Insurance Referral" : "Financial Services Referral",
                    provider,
                    status: "pending",
                    createdAt: new Date().toISOString(),
                  };
                  add(req);
                  toast({ title: "Referral requested", description: "We will email you provider details shortly." });
                }} />
              </ServiceCard>
            </section>

            <aside className="mt-8 rounded-lg border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  Payments and bookings are placeholders. Connect Stripe and Supabase Edge Functions (create-payment/create-checkout) to enable live checkout. Some items require an active Premium subscription.
                </p>
              </div>
            </aside>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>My Requests & Bookings</CardTitle>
                  <CardDescription>Track the status of your orders, consultations, and enrollments.</CardDescription>
                </CardHeader>
                <CardContent>
                  {requests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No requests yet. Place an order to see it here.</p>
                  ) : (
                    <ul className="space-y-3">
                      {requests.map((r) => (
                        <li key={r.id} className="rounded-md border p-3">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{r.title}</span>
                                <Badge variant="secondary">{r.type}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">Created {new Date(r.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-3 sm:mt-0">
                              {typeof r.priceCents === "number" && (
                                <span className="text-sm font-medium">{currency(r.priceCents)}</span>
                              )}
                              <StatusBadge status={r.status} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

// UI subcomponents
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  priceCents?: number;
  premiumOnly?: boolean;
  children: React.ReactNode;
}> = ({ icon, title, description, priceCents, premiumOnly, children }) => {
  const premium = isPremium();
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-muted p-2" aria-hidden>
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          {premiumOnly && <Badge>Premium</Badge>}
          {typeof priceCents === "number" && (
            <span className="text-lg font-semibold">{currency(priceCents)}</span>
          )}
        </div>
        <div className="flex-1" />
        <div>{premiumOnly && !premium ? <UpgradeHint /> : children}</div>
      </CardContent>
    </Card>
  );
};

const UpgradeHint: React.FC = () => (
  <div className="flex items-center gap-2">
    <Badge variant="secondary">Premium</Badge>
    <Button
      variant="outline"
      size="sm"
      onClick={() => toast({ title: "Upgrade to Premium", description: "Connect Stripe to enable premium checkout.", })}
    >
      Upgrade
    </Button>
  </div>
);

// Document order dialog
const DocumentOrderDialog: React.FC<{
  onCreate: (payload: { documentType: string; description?: string; files?: File[] }) => Promise<void> | void;
}> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState<string>("Visa Letter");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[] | undefined>(undefined);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    const accepted = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const arr: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList.item(i)!;
      if (!accepted.includes(f.type)) {
        toast({ title: "Invalid file type", description: `${f.name} is not a PDF/DOC/DOCX.`, variant: "destructive" });
        continue;
      }
      if (f.size > maxSize) {
        toast({ title: "File too large", description: `${f.name} exceeds 5MB.`, variant: "destructive" });
        continue;
      }
      arr.push(f);
    }
    setFiles(arr);
  };

  const submit = async () => {
    await onCreate({ documentType, description, files });
    toast({ title: "Order created", description: "Document preparation request submitted." });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Order Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Document Preparation</DialogTitle>
          <DialogDescription>Provide details and upload any relevant files.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="doc-type">Document type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="doc-type">
                <SelectValue placeholder="Choose a document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visa Letter">Visa Letter</SelectItem>
                <SelectItem value="Reference Letter">Reference Letter</SelectItem>
                <SelectItem value="Cover Letter">Cover Letter</SelectItem>
                <SelectItem value="Invitation Letter">Invitation Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="doc-notes">Notes</Label>
            <Textarea id="doc-notes" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add any specific requirements" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="doc-files">Upload files (PDF/DOC/DOCX, max 5MB each)</Label>
            <Input id="doc-files" type="file" multiple accept=".pdf,.doc,.docx" onChange={onFileChange} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit}>Proceed to Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Consultation booking
const ConsultationDialog: React.FC<{
  onCreate: (payload: { datetime: string; duration: number }) => Promise<void> | void;
}> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [datetime, setDatetime] = useState<string>("");
  const [duration, setDuration] = useState<number>(30);

  const submit = async () => {
    if (!datetime) {
      toast({ title: "Select date & time", description: "Please choose a consultation slot.", variant: "destructive" });
      return;
    }
    await onCreate({ datetime, duration });
    toast({ title: "Consultation booked", description: "We'll send a confirmation email shortly." });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Book Consultation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Expert Consultation</DialogTitle>
          <DialogDescription>Choose a preferred date and time. Slots are limited.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="slot">Date & time</Label>
            <Input id="slot" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit}>Proceed to Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Language enroll
const LanguageEnroll: React.FC<{
  onCreate: (payload: { packageName: string; level: string }) => Promise<void> | void;
}> = ({ onCreate }) => {
  const [packageName, setPackageName] = useState("IELTS Intensive");
  const [level, setLevel] = useState("Intermediate");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="grid gap-2">
        <Label>Package</Label>
        <Select value={packageName} onValueChange={setPackageName}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IELTS Intensive">IELTS Intensive</SelectItem>
            <SelectItem value="TOEFL Booster">TOEFL Booster</SelectItem>
            <SelectItem value="Interview Coaching">Interview Coaching</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Level</Label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="sm:ml-auto" onClick={() => onCreate({ packageName, level })}>Enroll</Button>
    </div>
  );
};

const ReferralForm: React.FC<{ onCreate: (provider: "insurance" | "financial") => void }> = ({ onCreate }) => {
  const [provider, setProvider] = useState<"insurance" | "financial">("insurance");
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="grid gap-2">
        <Label>Provider</Label>
        <Select value={provider} onValueChange={(v) => setProvider(v as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="financial">Financial Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="sm:ml-auto" onClick={() => onCreate(provider)}>Request Referral</Button>
    </div>
  );
};

const StatusBadge: React.FC<{ status: ServiceRequest["status"] }> = ({ status }) => {
  const map: Record<ServiceRequest["status"], { label: string; variant?: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "Pending", variant: "secondary" },
    in_progress: { label: "In progress", variant: "default" },
    completed: { label: "Completed", variant: "outline" },
    cancelled: { label: "Cancelled", variant: "destructive" },
    payment_pending: { label: "Payment pending", variant: "secondary" },
  };
  const cfg = map[status];
  return (
    <Badge variant={cfg.variant}>{cfg.label}</Badge>
  );
};

export default Addons;
