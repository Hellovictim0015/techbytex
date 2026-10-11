"use client";
import { PhoneCall, MessageSquareText } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingContact() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const phoneNumber = "918827219873";
  const whatsappMessage = encodeURIComponent(
    "Hello, I am interested in your services."
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      <a
        href={`tel:+${phoneNumber}`}
        className="bg-[#7C3AED] text-white py-3 px-5 rounded-xl shadow-lg hover:bg-[#6D28D9] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 font-medium"
        aria-label="Call Us"
      >
        <PhoneCall size={20} />
        <span>Call Us</span>
      </a>

      <a
        href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#7C3AED] text-white py-3 px-5 rounded-xl shadow-lg hover:bg-[#6D28D9] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 font-medium"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquareText size={20} />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
