import headshotFallback from "../assets/images/1723628031938.jpeg";

export const profile = {
  name: "Ammaar Murshid",
  role: "DevOps Platform Engineer",
  employer: "CGI",
  location: "London, UK",
  handle: "ammaar",
  cvUrl: "/Ammaar_Murshid_CV.pdf",
  headshot: {
    url: headshotFallback.src,
    alt: "Portrait of Ammaar Murshid",
    width: 320,
    height: 320,
  },
  fallback: headshotFallback,
  links: {
    email: "mailto:ammaar720@hotmail.co.uk",
    github: "https://github.com/ammaarM",
    linkedin: "https://www.linkedin.com/in/ammaar-murshid-92119218a/",
  },
  /** Headline certifications, as listed on the CV (fundamentals-level ones omitted). */
  certifications: [
    "Certified Kubernetes Administrator (CKA)",
    "AWS Solutions Architect Associate",
    "Microsoft Azure Administrator Associate",
    "HashiCorp Terraform Associate",
    "Kubernetes and Cloud Native Associate (KCNA)",
  ],
  /** Fundamentals-level certifications; with the five above they make the "7 certifications" stat. */
  fundamentals: [
    "Microsoft Azure Fundamentals",
    "Microsoft Azure Data Fundamentals",
  ],
  stats: [
    {
      value: "24/7",
      label: "billing platform where I'm primary on IaC and pipelines",
    },
    { value: "7", label: "certifications, incl. CKA and AWS SAA" },
    { value: "3+", label: "years in industry" },
  ],
} as const;

/** Career history, newest first. Rendered as a `git log`-style timeline. */
export const experience = [
  {
    date: "Mar 2026 – now",
    title: "DevOps Platform Engineer III",
    org: "CGI",
    summary:
      "Primary maintainer of the IaC and deployed infrastructure (controlled jointly with the solution architect) and primary engineer for all DevOps pipelines and release optimisation on a global oil & gas fuel card billing system: 24/7, batch-based, mission-critical. I review and approve infrastructure changes from CGI and client engineers, lead Kubernetes workload orchestration, and champion safe, governed use of agentic AI in delivery.",
  },
  {
    date: "Nov 2025 – Mar 2026",
    title: "DevOps Platform Engineer II",
    org: "CGI",
    summary:
      "Kept five production-grade environments available and compliant. Led Azure cost automation, extended the Terraform codebase with reusable modules, tightened GitHub Actions deployment safety, and introduced agentic AI coding workflows to the team.",
  },
  {
    date: "Aug 2024 – Oct 2025",
    title: "Junior DevOps Platform Engineer, Technical Graduate",
    org: "CGI",
    summary:
      "Rewrote the full infrastructure deployment pipeline for security and efficiency, provisioned environments with Terraform, and automated recurring operations with PowerShell and Python.",
  },
  {
    date: "Sep 2022 – Sep 2023",
    title: "Junior Cloud Engineer, Industrial Placement",
    org: "CGI",
    summary:
      "Helped migrate a global payment solution from on-prem to Azure. Designed Terraform environments from POC to production, including DR for a microservices platform, and built Azure DevOps pipelines.",
  },
  {
    date: "Sep 2020 – May 2024",
    title: "BSc Computer Science, 2:1",
    org: "City, University of London",
    summary: "",
  },
] as const;

export type Profile = typeof profile;
export type Experience = (typeof experience)[number];
