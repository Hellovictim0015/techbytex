# TechByteX SEO Strategy & Growth Plan

This is the non-code companion to the SEO implementation shipped in this codebase. Everything here is a strategy/process deliverable — actions to take outside the repo (Search Console, GBP, backlinks) or judgment calls that don't belong in a data file.

---

## 1. What shipped in code (for reference)

- `/services/[12 services]` — dedicated, fully unique money pages (website, ecommerce, mobile app, React Native, Android, iOS, React, Next.js, Node.js, UI/UX, custom software, AI)
- `/web-development-[22 cities]` + `/web-development-chhattisgarh` hub — unique local landing pages, no duplicate content
- `/app-development-bhilai` — dedicated app-dev local page
- Schema: Organization, LocalBusiness (per city), WebSite+SearchAction, Service (ItemList + single), Breadcrumb (every page), FAQPage (every service/city/contact page), Person (team)
- `robots.ts`, `sitemap.ts` (fully data-driven, zero orphans), `manifest.ts`
- Next/Image everywhere (was raw `<img>` in 5 components — fixed)
- 3 new 1,200–1,800 word articles + a 100-topic content calendar (`src/app/data/blogTopics.js`)

---

## 2. Keyword Map

### Primary (home / services index)
website development company, app development company, mobile app development company, software development company, website design company

### Secondary (one per service page — already the H1/title on each `/services/*` page)
React Native development, Next.js development, React development, Node.js development, UI/UX design company, ecommerce website development, custom software development company, AI development company, Android app development, iOS app development

### Local (one per city page — already targeted)
website development company Raipur / Bilaspur / Durg / Bhilai / Korba / Jagdalpur / Raigarh / Rajnandgaon / Ambikapur / Dhamtari / Balod / Mahasamund / Kanker / Kondagaon / Bastar / Sukma / Dantewada / Bemetara / Kawardha / Janjgir-Champa / Balrampur / Dalli Rajhara

### Long-tail / commercial
"best website development company in Chhattisgarh", "affordable website development company Raipur", "hire React Native developer India", "ecommerce website development cost India", "hospital website design company"

### Question keywords (target via blog — see content calendar)
"how much does a website cost in India", "how long does app development take", "should I use Shopify or custom ecommerce", "is React Native good for production apps", "how to choose a website development company"

### Voice search / conversational
"who builds websites near me", "best app developer near Raipur", "website development company open now", "how do I get a website made for my shop"

### Near-me / local-intent
"website developer near me", "app developer near me", "web design company near me" — served primarily through Google Business Profile + the city pages, since "near me" ranking is driven more by GBP proximity signals than on-page content

### International (secondary targeting — USA/UK/Canada/Australia/UAE/Germany/Singapore)
website development company India, offshore Next.js development, hire React Native developers India, custom software development outsourcing India

**Note on international SEO:** the brief asks for hreflang — we deliberately did **not** add hreflang tags, because hreflang only makes sense across genuinely separate locale/language page variants (e.g. `/en-us/`, `/en-gb/`), and none exist yet. Adding hreflang pointing at non-existent alternates would be an incorrect implementation that Google would flag. If international targeting becomes a real priority, the correct next step is either (a) a dedicated `/global` or `/en` variant with USD pricing and outsourcing-focused copy, then hreflang between it and the India version, or (b) simpler: just set international targeting intent through content (already partially done via "India, USA, UK, Canada, Australia, UAE, Germany, Singapore" in the `about`/service copy) and Search Console's country targeting settings.

---

## 3. Backlink Plan (100 opportunities)

**Business & startup directories (India)**
Google Business Profile, JustDial, Sulekha, IndiaMART, TradeIndia, Clutch.co, GoodFirms, DesignRush, AppFutura, Crunchbase, AngelList/Wellfound, ProductHunt (for any internal tool/AI product), Startup India portal, Chhattisgarh Startup Cell / CGCCI (Chamber of Commerce Chhattisgarh), Raipur Municipal business listings, IndiaFilings directory, Yellow Pages India, Trustpilot, AmbitionBox (as employer), Glassdoor (as employer)

**Developer / tech communities**
Dev.to, Hashnode (cross-post technical articles from the blog), Stack Overflow (company profile + genuine answers linking to relevant articles, never spammy), GitHub org profile with README linking to site, Product Hunt, Indie Hackers, Reddit r/webdev / r/reactjs / r/nextjs (participate genuinely, don't drop links), Hacker News (only if content is genuinely link-worthy)

**Design / agency directories**
Clutch, GoodFirms, DesignRush, Behance (portfolio pieces), Dribbble (UI/UX work), Awwwards (if a project qualifies), CSS Design Awards

**Guest posting targets (India tech/business blogs)**
YourStory, Inc42, Entrepreneur India, Financial Express (Tech section), business/tech sections of regional publications, Medium publications on web dev / startups, freeCodeCamp (technical, high-effort only), LogRocket Blog, Smashing Magazine (technical, high bar)

**Local Chhattisgarh directories & press**
Local Raipur/Bilaspur/Bhilai business directories, Chhattisgarh news portals' business sections, local Chamber of Commerce listings per district, district industry association websites (steel/mining ancillary associations in Bhilai/Durg/Korba are realistic targets given the client base)

**Partnership / natural links**
Client testimonial link-backs (ask happy clients to link to techbytex.in from their own site's "built by" or footer credit — this is already in the Footer copyright line), technology partner co-marketing (if using Razorpay/Stripe/Vercel affiliate or partner directories), local college placement/tech-fest sponsorships (Chhattisgarh engineering colleges) for a natural .edu-adjacent mention

**How to prioritize:** Google Business Profile + 5–10 high-relevance directories (Clutch, GoodFirms, JustDial, Sulekha) first — highest effort-to-value ratio. Guest posting and dev-community content should follow the blog content calendar so each guest post links back to a real, deep article rather than a thin service page.

---

## 4. Google Business Profile Plan

1. Claim/verify GBP with **exact NAP match** to the website footer: name "TechByteX", phone +91-8827219873, address as listed in `lib/seo.js` (Dalli Rajhara, Chhattisgarh 491228).
2. Category: primary "Website Designer" or "Software Company"; secondary categories for "Web Developer", "Mobile App Developer".
3. Service area: add every city from `src/app/data/cities.js` as a served area (GBP supports multiple service areas for service-area businesses).
4. Add all 12 services as GBP "Services" with the same descriptions used on `/services/*` pages (consistency helps relevance).
5. Upload real project screenshots (the ones already in `/public`) as GBP photos — do this regularly, not just once.
6. **Reviews:** ask real clients directly after project delivery. Never buy or fabricate reviews — this is both a Google policy violation and, more simply, dishonest; we did not add fake Review/AggregateRating schema to the site for the same reason.
7. Use GBP Posts weekly, linking to the most relevant service or city page for that update.
8. Keep NAP identical across GBP, website, and every directory listed in Section 3 — inconsistent NAP is one of the most common local-SEO ranking blockers.

---

## 5. Search Console / Analytics / Bing / IndexNow Checklist

**Google Search Console**
- [ ] Verify property for `https://www.techbytex.in` (DNS or HTML tag method)
- [ ] Submit `https://www.techbytex.in/sitemap.xml`
- [ ] Set preferred domain / check `www` vs non-`www` canonicalization matches `SITE_URL` in `lib/seo.js`
- [ ] Request indexing for the new `/services/*` and `/web-development-*` pages after deploy (don't wait for organic crawl)
- [ ] Monitor Core Web Vitals report weekly for the first month
- [ ] Check Coverage report for any pages Google can't index

**Google Analytics 4**
- [ ] Create GA4 property, add measurement ID to the site (currently not wired into the codebase — needs a `<Script>` in `layout.js` with the real GA4 ID once created)
- [ ] Set up key conversion events: contact form submit, WhatsApp click, call click, book-demo submit
- [ ] Link GA4 to Search Console for combined reporting

**Bing Webmaster Tools**
- [ ] Verify site (can import directly from Search Console)
- [ ] Submit the same `sitemap.xml`
- [ ] Bing has a smaller but real share of India search traffic — low effort, don't skip it

**IndexNow**
- [ ] Generate an IndexNow API key, host it at `/[key].txt` in `public/`
- [ ] Ping IndexNow's endpoint whenever a new city/service/blog page is published, so Bing (and Yandex) get near-instant crawl signals instead of waiting for the next crawl cycle
- [ ] This matters most right after this SEO relaunch, when 30+ new URLs go live at once

---

## 6. Monthly SEO Growth Plan

**Month 1 — Foundation (this pass)**
Ship everything in this repo: service pages, city pages, schema, technical fixes. Submit sitemap to GSC/Bing. Claim/optimize GBP. Request indexing on priority pages (home, `/services`, top 5 city pages).

**Month 2 — Authority building**
Publish 8–10 articles from the content calendar (`blogTopics.js`), prioritizing the "Local SEO" and city-adjacent topics first since they compound with the new location pages. Submit to 10 priority directories from Section 3.

**Month 3 — Content depth + local citations**
Publish another 8–10 articles. Push local citations (JustDial, Sulekha, Chamber of Commerce listings) live. Start collecting genuine client reviews on GBP.

**Month 4 — Link building push**
2–3 guest posts on relevant dev/business blogs. Reach out for testimonial link-backs from past clients. Review GSC Coverage + Performance reports, fix any pages with impressions but no clicks (title/meta issue) or clicks but high bounce (content/speed issue).

**Month 5 — Conversion optimization**
Once traffic is flowing, A/B-test hero copy and CTA wording on the highest-traffic city/service pages using GA4 event data. Add real client testimonials with genuine, attributed reviews (never fabricated) once enough exist.

**Month 6 — Review & expand**
Full keyword ranking audit. Identify which cities/services are ranking vs. which need more content depth or backlinks. Expand the highest-opportunity pages (e.g., write a dedicated long article for whichever city/service is closest to page 1 but not there yet). Continue content calendar at 8–10 articles/month indefinitely.

**Ongoing, every month:** publish from the content calendar, monitor Core Web Vitals (Next.js/Vercel makes regressions rare but images/fonts can drift), keep NAP consistent everywhere, respond to every GBP review.
