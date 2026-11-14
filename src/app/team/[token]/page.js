import { notFound } from "next/navigation";
import { memberByToken, leadsForMember } from "@/app/lib/team-leads";
import TeamLeadsClient from "./TeamLeadsClient";

// A marketing team member's private page (link shared from Admin → Lead Assign).
// The token in the URL is the only key, so the page is never indexed or cached.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Leads | TechByteX",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default async function TeamLeadsPage({ params }) {
  const { token } = await params;
  const member = await memberByToken(token);
  if (!member) notFound();
  const leads = await leadsForMember(member.id);
  return <TeamLeadsClient token={token} memberName={member.name} leads={leads} />;
}
