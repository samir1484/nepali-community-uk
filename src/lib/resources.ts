/**
 * Curated links to official sources. These are deliberately hard-coded rather
 * than admin-editable: they're the authoritative government and charity pages
 * that shouldn't drift, and they make the section useful on day one before any
 * guides have been written.
 */
export type ResourceLink = {
  title: string;
  description: string;
  url: string;
  source: string;
};

export const IMMIGRATION_LINKS: ResourceLink[] = [
  {
    title: "Check if you need a UK visa",
    description: "The official tool that tells you what you need based on your nationality and reason for coming.",
    url: "https://www.gov.uk/check-uk-visa",
    source: "GOV.UK",
  },
  {
    title: "Find a registered immigration adviser",
    description: "Search OISC-regulated advisers and solicitors. Anyone charging for immigration advice must be on here.",
    url: "https://www.gov.uk/find-an-immigration-adviser",
    source: "GOV.UK",
  },
  {
    title: "Skilled Worker visa",
    description: "Eligibility, salary thresholds, how to apply, and what your employer needs to do.",
    url: "https://www.gov.uk/skilled-worker-visa",
    source: "GOV.UK",
  },
  {
    title: "View and prove your immigration status (eVisa)",
    description: "Share your status with employers and landlords. Physical BRP cards have been replaced by eVisas.",
    url: "https://www.gov.uk/view-prove-immigration-status",
    source: "GOV.UK",
  },
  {
    title: "Apply to the EU Settlement Scheme or extend your stay",
    description: "Options for staying longer in the UK, including switching to a different visa.",
    url: "https://www.gov.uk/browse/visas-immigration",
    source: "GOV.UK",
  },
  {
    title: "Nepal Embassy, London",
    description: "Passport renewal, consular services and documents for Nepali nationals in the UK.",
    url: "https://uk.nepalembassy.gov.np/",
    source: "Embassy of Nepal",
  },
];

export const STUDENT_LINKS: ResourceLink[] = [
  {
    title: "UKCISA — advice for international students",
    description: "The main independent charity for international students: visas, working rights, fees and support.",
    url: "https://www.ukcisa.org.uk/",
    source: "UKCISA",
  },
  {
    title: "Student visa",
    description: "Requirements, financial evidence, how long you can stay and how many hours you can work.",
    url: "https://www.gov.uk/student-visa",
    source: "GOV.UK",
  },
  {
    title: "Graduate visa",
    description: "Stay and work for two years after your course (three with a PhD), with no job offer needed.",
    url: "https://www.gov.uk/graduate-visa",
    source: "GOV.UK",
  },
  {
    title: "Student finance and scholarships",
    description: "What funding international and settled students can apply for.",
    url: "https://www.gov.uk/student-finance",
    source: "GOV.UK",
  },
  {
    title: "Register with a GP",
    description: "NHS care is free to register for. Do this when you arrive, not when you're ill.",
    url: "https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/",
    source: "NHS",
  },
  {
    title: "Know your rights at work",
    description: "Minimum wage, holiday, payslips and what to do if an employer breaks the rules.",
    url: "https://www.gov.uk/browse/working",
    source: "GOV.UK",
  },
];

export const ARRIVAL_STEPS: Array<{ title: string; body: string }> = [
  {
    title: "Set up your eVisa access",
    body: "Create a UKVI account and check you can view and share your status. Employers and landlords will ask for a share code.",
  },
  {
    title: "Get a National Insurance number",
    body: "You can start work before it arrives, but you'll need it for correct tax. Apply as soon as you're in the UK.",
  },
  {
    title: "Open a UK bank account",
    body: "Most banks want proof of address and your immigration status. A university letter or tenancy agreement usually works.",
  },
  {
    title: "Register with a GP",
    body: "Free and worth doing straight away — you'll need to be registered before you need care, not after.",
  },
  {
    title: "Sort travel and phone",
    body: "A railcard, a local SIM and a contactless bank card will save you more than most people expect in the first month.",
  },
];
