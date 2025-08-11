import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Types
type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  countryOfOrigin: string;
  destinationPreference: string;
};

type Certification = { id: string; name: string; issuer: string; year: string };

type Experience = {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  description: string;
};

type LanguagePref = { id: string; language: string; level: string };

type DocumentMeta = { id: string; name: string; size: number; type: string; addedAt: string };

type ProfileData = {
  personal: PersonalInfo;
  skills: string[];
  certifications: Certification[];
  experience: Experience[];
  languages: LanguagePref[];
  documents: DocumentMeta[];
};

const STORAGE_KEY = "am_profile";

export default function Profile() {
  // State
  const [personal, setPersonal] = useState<PersonalInfo>({
    name: "",
    email: "",
    phone: "",
    countryOfOrigin: "",
    destinationPreference: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [certs, setCerts] = useState<Certification[]>([]);
  const [certDraft, setCertDraft] = useState<Certification>({ id: "", name: "", issuer: "", year: "" });

  const [exp, setExp] = useState<Experience[]>([]);
  const [expDraft, setExpDraft] = useState<Experience>({ id: "", role: "", company: "", start: "", end: "", description: "" });

  const [languages, setLanguages] = useState<LanguagePref[]>([]);
  const [langDraft, setLangDraft] = useState<LanguagePref>({ id: "", language: "", level: "" });

  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load from mock backend
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as ProfileData;
        setPersonal(data.personal);
        setSkills(data.skills || []);
        setCerts(data.certifications || []);
        setExp(data.experience || []);
        setLanguages(data.languages || []);
        setDocuments(data.documents || []);
      }
    } catch {
      // ignore
    }
  }, []);

  const canSave = useMemo(() => {
    return personal.name.trim().length > 0;
  }, [personal.name]);

  // Handlers
  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (skills.includes(v)) {
      toast.info("Skill already added");
      return;
    }
    setSkills((s) => [...s, v]);
    setSkillInput("");
  };

  const removeSkill = (val: string) => setSkills((s) => s.filter((i) => i !== val));

  const addCert = () => {
    if (!certDraft.name.trim()) return toast.error("Certification name is required");
    const item: Certification = { ...certDraft, id: crypto.randomUUID() };
    setCerts((c) => [item, ...c]);
    setCertDraft({ id: "", name: "", issuer: "", year: "" });
  };

  const removeCert = (id: string) => setCerts((c) => c.filter((x) => x.id !== id));

  const addExp = () => {
    if (!expDraft.role.trim() || !expDraft.company.trim()) return toast.error("Role and Company are required");
    const item: Experience = { ...expDraft, id: crypto.randomUUID() };
    setExp((e) => [item, ...e]);
    setExpDraft({ id: "", role: "", company: "", start: "", end: "", description: "" });
  };

  const removeExp = (id: string) => setExp((e) => e.filter((x) => x.id !== id));

  const addLanguage = () => {
    if (!langDraft.language.trim()) return toast.error("Language is required");
    const item: LanguagePref = { ...langDraft, id: crypto.randomUUID() };
    setLanguages((l) => [item, ...l]);
    setLangDraft({ id: "", language: "", level: "" });
  };

  const removeLanguage = (id: string) => setLanguages((l) => l.filter((x) => x.id !== id));

  const onUploadDocs = (files: FileList | null) => {
    if (!files) return;
    const accepted: DocumentMeta[] = [];
    Array.from(files).forEach((file) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!isPdf) {
        toast.error(`Rejected ${file.name}: only PDF allowed`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`Rejected ${file.name}: exceeds 5MB`);
        return;
      }
      accepted.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type || "application/pdf",
        addedAt: new Date().toISOString(),
      });
    });
    if (accepted.length) {
      setDocuments((d) => [...accepted, ...d]);
      toast.success(`${accepted.length} file(s) added`);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDoc = (id: string) => setDocuments((d) => d.filter((x) => x.id !== id));

  // Mock backend save (replace with Supabase integration)
  const saveProfile = async () => {
    const payload: ProfileData = {
      personal,
      skills,
      certifications: certs,
      experience: exp,
      languages,
      documents,
    };
    // TODO: Replace with Supabase when connected via Lovable's native integration
    // Example:
    // const { data, error } = await supabase.from('profiles').upsert({ ...payload, user_id });
    // if (error) throw error;
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    toast.success("Profile saved");
  };

  return (
    <>
      <Helmet>
        <title>Profile & Settings | Afrimigrate</title>
        <meta name="description" content="Manage your profile, skills, experience, languages, and CV documents in one place." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/profile'} />
      </Helmet>

      <header className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Keep your information up to date to get better job and visa matches.</p>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="mb-4 flex justify-end">
          <Button onClick={saveProfile} disabled={!canSave} variant="brand">Save Changes</Button>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full flex flex-wrap gap-2">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certs">Certifications</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="Jane Doe" value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="jane@example.com" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+234 800 000 0000" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Country of Origin</label>
                    <Input placeholder="Nigeria" value={personal.countryOfOrigin} onChange={(e) => setPersonal({ ...personal, countryOfOrigin: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Destination Preferences</label>
                    <Input placeholder="Canada, UK" value={personal.destinationPreference} onChange={(e) => setPersonal({ ...personal, destinationPreference: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill (e.g., React, Data Analysis)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No skills yet. Add your first skill.</p>
                    ) : (
                      skills.map((s) => (
                        <Badge key={s} variant="secondary" className="flex items-center gap-2">
                          {s}
                          <button className="text-muted-foreground hover:text-foreground" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                            ×
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certs">
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input placeholder="Name (e.g., AWS SAA)" value={certDraft.name} onChange={(e) => setCertDraft({ ...certDraft, name: e.target.value })} />
                  <Input placeholder="Issuer (e.g., Amazon)" value={certDraft.issuer} onChange={(e) => setCertDraft({ ...certDraft, issuer: e.target.value })} />
                  <Input placeholder="Year" value={certDraft.year} onChange={(e) => setCertDraft({ ...certDraft, year: e.target.value })} />
                  <Button onClick={addCert}>Add</Button>
                </div>
                <ul className="mt-4 space-y-2">
                  {certs.length === 0 && (
                    <li className="text-sm text-muted-foreground">No certifications added.</li>
                  )}
                  {certs.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{c.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{c.issuer} • {c.year}</p>
                      </div>
                      <Button variant="outline" onClick={() => removeCert(c.id)}>Remove</Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Role" value={expDraft.role} onChange={(e) => setExpDraft({ ...expDraft, role: e.target.value })} />
                  <Input placeholder="Company" value={expDraft.company} onChange={(e) => setExpDraft({ ...expDraft, company: e.target.value })} />
                  <Input placeholder="Start (e.g., 2022-01)" value={expDraft.start} onChange={(e) => setExpDraft({ ...expDraft, start: e.target.value })} />
                  <Input placeholder="End (e.g., 2024-06 or Present)" value={expDraft.end} onChange={(e) => setExpDraft({ ...expDraft, end: e.target.value })} />
                  <div className="md:col-span-2">
                    <Textarea placeholder="Describe your responsibilities and impact" value={expDraft.description} onChange={(e) => setExpDraft({ ...expDraft, description: e.target.value })} />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button onClick={addExp}>Add Experience</Button>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {exp.length === 0 && (
                    <li className="text-sm text-muted-foreground">No experience added.</li>
                  )}
                  {exp.map((e) => (
                    <li key={e.id} className="rounded-md border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{e.role} • {e.company}</p>
                          <p className="text-sm text-muted-foreground">{e.start} — {e.end}</p>
                        </div>
                        <Button variant="outline" onClick={() => removeExp(e.id)}>Remove</Button>
                      </div>
                      {e.description && (
                        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{e.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="languages">
            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Language (e.g., English)" value={langDraft.language} onChange={(e) => setLangDraft({ ...langDraft, language: e.target.value })} />
                  <Input placeholder="Level (e.g., Fluent, B2)" value={langDraft.level} onChange={(e) => setLangDraft({ ...langDraft, level: e.target.value })} />
                  <Button onClick={addLanguage}>Add</Button>
                </div>
                <ul className="mt-4 space-y-2">
                  {languages.length === 0 && (
                    <li className="text-sm text-muted-foreground">No languages set.</li>
                  )}
                  {languages.map((l) => (
                    <li key={l.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">{l.language}</p>
                        <p className="text-sm text-muted-foreground">{l.level}</p>
                      </div>
                      <Button variant="outline" onClick={() => removeLanguage(l.id)}>Remove</Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>CV & Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Upload CV (PDF, max 5MB)</label>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={(e) => onUploadDocs(e.target.files)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Tip: Name your file clearly, e.g., Jane-Doe-CV.pdf</p>
                  </div>

                  <ul className="space-y-2">
                    {documents.length === 0 && (
                      <li className="text-sm text-muted-foreground">No documents uploaded.</li>
                    )}
                    {documents.map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{(d.size / 1024).toFixed(1)} KB • {new Date(d.addedAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="outline" onClick={() => removeDoc(d.id)}>Remove</Button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-end">
                    <Button onClick={saveProfile} variant="brand">Save Documents</Button>
                  </div>

                  <div className="rounded-md border p-3 text-sm text-muted-foreground">
                    Placeholder: Connect to official storage via Supabase for secure file storage. PDF files are validated on client. When Supabase is connected, store in Storage and keep metadata in a table.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={saveProfile} disabled={!canSave} variant="brand">Save Changes</Button>
        </div>

        <aside className="mt-6 text-sm text-muted-foreground">
          To enable secure backend storage (auth, database, file storage), connect Supabase via Lovable's native integration.
        </aside>
      </main>
    </>
  );
}
