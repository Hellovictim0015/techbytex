import React from "react";
import Image from "next/image";
import { Server, Settings, CreditCard } from "lucide-react";

// Tools and platforms we build with — not official partnerships.
// Logos are self-hosted in public/tech.
const groups = [
  {
    title: "Cloud & Hosting",
    Icon: Server,
    items: [
      { name: "AWS", logo: "/tech/aws.svg" },
      { name: "Google Cloud", logo: "/tech/google-cloud.png" },
      { name: "Microsoft Azure", logo: "/tech/azure.svg" },
      { name: "Oracle", logo: "/tech/oracle.svg" },
    ],
  },
  {
    title: "DevOps & Collaboration",
    Icon: Settings,
    items: [
      { name: "GitHub", logo: "/tech/github.svg" },
      { name: "GitLab", logo: "/tech/gitlab.svg" },
      { name: "Docker", logo: "/tech/docker.svg" },
      { name: "Kubernetes", logo: "/tech/kubernetes.svg" },
      { name: "Jenkins", logo: "/tech/jenkins.svg" },
      { name: "Jira", logo: "/tech/jira.svg" },
      { name: "Slack", logo: "/tech/slack.svg" },
    ],
  },
  {
    title: "Payment Gateways",
    Icon: CreditCard,
    items: [
      { name: "Razorpay", logo: "/tech/razorpay.svg" },
      { name: "Stripe", logo: "/tech/stripe.svg" },
    ],
  },
];

const PartnersSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent"></div>

      <div className="container mx-auto px-4 mb-12 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-4">
          Ecosystem
        </span>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Technologies we work with</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          The cloud platforms, developer tools and payment gateways we use to build and run your project.
        </p>
      </div>

      <div className="container mx-auto px-4 space-y-10">
        {groups.map(({ title, Icon, items }) => (
          <div key={title}>
            <h3 className="flex items-center justify-center gap-2 mb-4 text-sm font-semibold text-slate-400 uppercase tracking-widest">
              <Icon size={14} className="text-[#7C3AED]" /> {title}
            </h3>
            <ul className="flex flex-wrap justify-center gap-4">
              {items.map((item) => (
                <li
                  key={item.name}
                  className="w-36 h-16 sm:w-44 sm:h-20 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center p-4"
                >
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={128}
                    height={40}
                    sizes="128px"
                    unoptimized={item.logo.endsWith(".svg")}
                    loading="lazy"
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
