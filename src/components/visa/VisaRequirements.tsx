import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useState } from "react";

export interface VisaRequirementsProps {
  onNavigate: (page: string) => void;
}

interface RequirementResult {
  country: string;
  destination: string;
  visaType: string;
  required: boolean;
  fees?: string;
  processingTime?: string;
  requirements?: string[];
}

const countries = [
  "Malawi",
  "South Africa",
  "Kenya",
  "Tanzania",
  "Zambia",
  "Zimbabwe",
  "Botswana",
  "Nigeria",
  "Ghana",
  "Uganda",
];

const destinations = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "China",
  "Japan",
  "Dubai (UAE)",
  "South Africa",
];

const travelPurposes = ["Tourism", "Business", "Study", "Work", "Transit", "Medical", "Family Visit"];

export default function VisaRequirements({ onNavigate }: VisaRequirementsProps) {
  const [fromCountry, setFromCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [travelPurpose, setTravelPurpose] = useState("");
  const [passportNationality, setPassportNationality] = useState("");
  const [results, setResults] = useState<RequirementResult | null>(null);

  function handleCheckRequirements() {
    const mockResults: RequirementResult = {
      country: fromCountry,
      destination: destinationCountry,
      visaType: getVisaType(destinationCountry, travelPurpose),
      required: true,
      fees: getVisaFees(destinationCountry, travelPurpose),
      processingTime: "5-10 business days",
      requirements: getRequirements(destinationCountry, travelPurpose),
    };
    setResults(mockResults);
  }

  function getVisaType(destination: string, purpose: string) {
    if (destination === "South Africa" && purpose === "Tourism") return "eVisa";
    if (destination === "United States") return "Embassy Visa";
    if (destination === "Dubai (UAE)") return "Visa on Arrival";
    if (destination === "Kenya") return "ETA (Electronic Travel Authorization)";
    return "Embassy Visa";
  }

  function formatMWK(usdAmount: number) {
    const mwkAmount = usdAmount * 2000; // Example FX
    return `MWK ${mwkAmount.toLocaleString()}`;
  }

  function getVisaFees(destination: string, _purpose: string) {
    const usdFees: Record<string, number> = {
      "United States": 185,
      "United Kingdom": 130,
      Canada: 75,
      Australia: 105,
      "South Africa": 37,
      "Dubai (UAE)": 27,
      Kenya: 51,
    };
    const usdAmount = usdFees[destination] || 50;
    return formatMWK(usdAmount);
  }

  function getRequirements(_destination: string, purpose: string) {
    return [
      "Valid passport (6+ months validity)",
      "Completed visa application form",
      "Recent passport-sized photographs",
      "Proof of accommodation",
      "Return flight tickets",
      "Bank statements (3 months)",
      "Travel insurance",
      purpose === "Business" ? "Business invitation letter" : "Proof of employment",
    ];
  }

  return (
    <Card className="shadow-xl border bg-card">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Visa Requirements Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">From Country</label>
          <Select value={fromCountry} onValueChange={setFromCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Destination Country</label>
          <Select value={destinationCountry} onValueChange={setDestinationCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {destinations.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Travel Purpose</label>
          <Select value={travelPurpose} onValueChange={setTravelPurpose}>
            <SelectTrigger>
              <SelectValue placeholder="Select travel purpose" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {travelPurposes.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Passport Nationality</label>
          <Select value={passportNationality} onValueChange={setPassportNationality}>
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleCheckRequirements}
          variant="brand"
          className="w-full py-6 text-lg font-medium"
          disabled={!fromCountry || !destinationCountry || !travelPurpose || !passportNationality}
        >
          Check Requirements
        </Button>

        {results && (
          <Card className="mt-4 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Visa Requirements for {results.destination}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Visa Type</p>
                  <p className="font-semibold text-primary">{results.visaType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fees</p>
                  <p className="font-semibold text-accent">{results.fees}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                  <p className="font-semibold">{results.processingTime}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Required Documents</p>
                <ul className="space-y-2">
                  {results.requirements?.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={() => onNavigate("wizard")} className="w-full mt-2" variant="secondary">
                Apply for Visa
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
