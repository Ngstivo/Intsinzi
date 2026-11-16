const projectTypes: Record<string, string> = {
  web: "Web application", saas: "SaaS product", crm: "CRM or business software",
  booking: "Booking system", ai: "AI integration", api: "API integration",
  wp: "WordPress development", other: "Other",
};
const budgets: Record<string, string> = {
  "2000-4999": "2,000–4,999 PLN", "5000-9999": "5,000–9,999 PLN",
  "10000+": "10,000+ PLN", discuss: "To be discussed",
};
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  project_type: string;
  budget: string;
  preferred_language: string;
  description: string;
  demo_reference: string | null;
};

export const studioEmail = "nsteveintsinzi@gmail.com";

export function formatEnquiryEmail(job: Enquiry) {
  const canReply = /^[a-z0-9.!#$%&'*+/=?^_{}|~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(job.email);
  const lines = [
    `Name: ${job.name}`, `Email: ${job.email}`,
    job.company ? `Company: ${job.company}` : "",
    `Project: ${projectTypes[job.project_type] ?? job.project_type}`,
    `Budget: ${budgets[job.budget] ?? job.budget}`,
    `Preferred language: ${languageNames.of(job.preferred_language)}`,
    job.demo_reference ? `Reference demo: ${job.demo_reference}` : "",
  ].filter(Boolean);
  return {
    id: job.id,
    subject: "New project enquiry | Intsinzi Digital Studio",
    replyTo: canReply ? job.email : undefined,
    text: [...lines, "", "Project description", job.description, "", `Reference: ${job.id}`].join("\n"),
  };
}
