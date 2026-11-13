import React from "react";
import Image from "next/image";

// Logos of businesses we have built for. Alt text is the real client name.
const logos = [
  { name: "Balod Eco Tourism", src: "/clients/balod-eco-tourism.png" },
  { name: "Adhikar Studio", src: "/clients/adhikar-studio.png" },
  { name: "Adhikar Digitals", src: "/clients/adhikar-digitals.png" },
  { name: "Test Series Innovator", src: "/clients/test-series-innovator.png" },
  { name: "Store N Source", src: "/clients/store-n-source.png" },
  { name: "Tourmate India", src: "/clients/tourmate-india.png" },
  { name: "JaanoIndia", src: "/clients/jaanoindia.png" },
  { name: "PHS – People's Health Solution", src: "/clients/phs-peoples-health-solution.png" },
  { name: "Mining Shiksha", src: "/clients/mining-shiksha.png" },
  { name: "Morvi Crop Science", src: "/clients/morvi-crop-science.png" },
  { name: "Gram Panchayat Pura Tikra, Gaya (Bihar)", src: "/clients/gram-panchayat-pura-tikra.png" },
];

// One row, rendered twice for a seamless CSS loop (the copy is hidden from
// screen readers). Pauses on hover and for reduced-motion users.
const Brand = () => {
  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Businesses we have built for</h2>
        <p className="text-slate-500 mt-2">
          Tourism, education, healthcare, agriculture, retail and local government — across Chhattisgarh and India.
        </p>
      </div>

      <div className="brand-marquee relative w-full py-4">
        <div className="brand-track flex w-max gap-8">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 gap-8" aria-hidden={copy === 1 ? "true" : undefined}>
              {logos.map((logo) => (
                <li
                  key={logo.src}
                  className="w-48 h-20 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-4"
                >
                  <Image
                    src={logo.src}
                    alt={copy === 0 ? logo.name : ""}
                    width={160}
                    height={48}
                    sizes="160px"
                    loading="lazy"
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <style>{`
        .brand-marquee {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .brand-track { animation: brand-scroll 40s linear infinite; }
        .brand-marquee:hover .brand-track { animation-play-state: paused; }
        @keyframes brand-scroll { to { transform: translateX(calc(-50% - 1rem)); } }
        @media (prefers-reduced-motion: reduce) {
          .brand-track { animation: none; flex-wrap: wrap; justify-content: center; width: 100%; }
          .brand-track > ul[aria-hidden] { display: none; }
          .brand-track > ul { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default Brand;
