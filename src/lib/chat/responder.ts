import type { GroundingData } from "./grounding";
import { totalListings } from "./grounding";
import type { ChatLanguage } from "./language";

/**
 * Keyword responder that needs no API key — this is the default reply engine,
 * so it has to be genuinely useful in both languages rather than an apology.
 * If AI_PROVIDER is configured later, the route tries the model first and only
 * falls back here, making that upgrade a pure improvement.
 *
 * Every topic answers in whichever language the visitor chose, and patterns
 * cover English, Devanagari Nepali, and romanised Nepali, because plenty of
 * people type "kaha" rather than "कहाँ".
 */
type Topic = {
  patterns: RegExp[];
  reply: (data: GroundingData, lang: ChatLanguage) => string;
};

const t = (lang: ChatLanguage, en: string, ne: string) => (lang === "ne" ? ne : en);

const TOPICS: Topic[] = [
  // --- Jobs ---
  {
    patterns: [/\bjobs?\b/i, /vacanc/i, /employ/i, /hiring/i, /work\b/i, /career/i, /जागिर/, /काम/, /रोजगार/, /\bkaam\b/i, /\bjagir\b/i],
    reply: (d, lang) =>
      d.counts.JOB > 0
        ? t(
            lang,
            `There ${d.counts.JOB === 1 ? "is" : "are"} ${d.counts.JOB} job${d.counts.JOB === 1 ? "" : "s"} listed right now. You can browse them all on the Jobs page (/jobs), filter by city, and apply directly. To post a job yourself you'll need a free account.`,
            `अहिले ${d.counts.JOB} जागिर सूचीबद्ध छ${d.counts.JOB === 1 ? "" : "न्"}। Jobs पृष्ठ (/jobs) मा सबै हेर्न सक्नुहुन्छ, सहर अनुसार छान्न सक्नुहुन्छ, र सिधै आवेदन दिन सक्नुहुन्छ। आफैं जागिर राख्न निःशुल्क खाता चाहिन्छ।`
          )
        : t(
            lang,
            "No jobs are listed at the moment, but new ones are added by members regularly. Visit /jobs to check, or register free and you'll get an email whenever a job matching your interests is posted.",
            "अहिले कुनै जागिर सूचीबद्ध छैन, तर सदस्यहरूले नियमित रूपमा नयाँ थप्छन्। /jobs हेर्नुहोस्, वा निःशुल्क दर्ता गर्नुहोस् — तपाईंको रुचि अनुसारको जागिर आएपछि इमेल आउनेछ।"
          ),
  },
  // --- Rooms / housing ---
  {
    patterns: [/\brooms?\b/i, /hous(e|ing)/i, /\brent\b/i, /flat/i, /accommodation/i, /\bbasai\b/i, /कोठा/, /घर/, /भाडा/, /आवास/, /\bkotha\b/i],
    reply: (d, lang) =>
      d.counts.ROOM > 0
        ? t(
            lang,
            `${d.counts.ROOM} room${d.counts.ROOM === 1 ? "" : "s"} ${d.counts.ROOM === 1 ? "is" : "are"} available on the Rooms & Housing page (/rooms) — single rooms, shared rooms, studios and whole properties, with rent and availability shown. You can message the poster from the listing.`,
            `Rooms & Housing पृष्ठ (/rooms) मा ${d.counts.ROOM} कोठा उपलब्ध छ${d.counts.ROOM === 1 ? "" : "न्"} — एकल कोठा, साझा कोठा, स्टुडियो र पूरै घर, भाडा र उपलब्धता सहित। सूचीबाट पोस्ट गर्ने व्यक्तिलाई सन्देश पठाउन सक्नुहुन्छ।`
          )
        : t(
            lang,
            "No rooms are listed right now. Check /rooms again soon, or register free to get an email when a room is posted near you.",
            "अहिले कुनै कोठा सूचीबद्ध छैन। /rooms फेरि हेर्नुहोस्, वा निःशुल्क दर्ता गर्नुहोस् — नजिकै कोठा आएपछि इमेल आउनेछ।"
          ),
  },
  // --- Events ---
  {
    patterns: [/\bevents?\b/i, /festival/i, /dashain/i, /tihar/i, /teej/i, /mela/i, /programme|program\b/i, /कार्यक्रम/, /चाडपर्व/, /दशैं/, /तिहार/, /मेला/],
    reply: (d, lang) =>
      d.counts.EVENT > 0
        ? t(
            lang,
            `${d.counts.EVENT} event${d.counts.EVENT === 1 ? "" : "s"} ${d.counts.EVENT === 1 ? "is" : "are"} coming up — see /events for dates, venues and ticket links. Dashain, Tihar and Teej gatherings are usually posted here first.`,
            `${d.counts.EVENT} कार्यक्रम आउँदै छ${d.counts.EVENT === 1 ? "" : "न्"} — मिति, स्थान र टिकट लिंकको लागि /events हेर्नुहोस्। दशैं, तिहार र तीजका कार्यक्रम प्रायः यहीं पहिले राखिन्छ।`
          )
        : t(
            lang,
            "Nothing is listed on /events at the moment. If you're organising something, you can post it free once you've registered — and members interested in events get an email about it.",
            "अहिले /events मा कुनै कार्यक्रम छैन। तपाईं कुनै कार्यक्रम आयोजना गर्दै हुनुहुन्छ भने, दर्ता गरेपछि निःशुल्क राख्न सक्नुहुन्छ — कार्यक्रममा रुचि राख्ने सदस्यहरूलाई इमेल जान्छ।"
          ),
  },
  // --- Businesses ---
  {
    patterns: [/business/i, /restaurant/i, /shop/i, /grocer/i, /directory/i, /\bstore\b/i, /व्यापार/, /व्यवसाय/, /पसल/, /रेस्टुरेन्ट/],
    reply: (d, lang) =>
      d.counts.BUSINESS > 0
        ? t(
            lang,
            `The Business Directory (/businesses) lists ${d.counts.BUSINESS} Nepali-owned business${d.counts.BUSINESS === 1 ? "" : "es"} — each with services, a map of the location and contact details. Adding your own is free once registered.`,
            `Business Directory (/businesses) मा ${d.counts.BUSINESS} नेपाली स्वामित्वको व्यवसाय छ${d.counts.BUSINESS === 1 ? "" : "न्"} — सेवा, स्थानको नक्सा र सम्पर्क विवरण सहित। दर्ता गरेपछि आफ्नो व्यवसाय निःशुल्क थप्न सक्नुहुन्छ।`
          )
        : t(
            lang,
            "The Business Directory (/businesses) is just getting started. If you run a Nepali business in the UK, register and add it free — it's one of the easiest ways to be found by the community.",
            "Business Directory (/businesses) भर्खर सुरु भएको छ। तपाईं बेलायतमा नेपाली व्यवसाय चलाउनुहुन्छ भने, दर्ता गरी निःशुल्क थप्नुहोस् — समुदायले तपाईंलाई भेट्टाउने सजिलो उपाय यही हो।"
          ),
  },
  // --- Volunteering ---
  {
    patterns: [/volunteer/i, /charit/i, /\bhelp out\b/i, /स्वयंसेवा/, /स्वयंसेवक/],
    reply: (d, lang) =>
      d.counts.VOLUNTEER > 0
        ? t(
            lang,
            `${d.counts.VOLUNTEER} volunteer opportunit${d.counts.VOLUNTEER === 1 ? "y is" : "ies are"} listed on /volunteer, with the organisation and time commitment shown.`,
            `/volunteer मा ${d.counts.VOLUNTEER} स्वयंसेवा अवसर सूचीबद्ध छ${d.counts.VOLUNTEER === 1 ? "" : "न्"}, संस्था र समय दिनुपर्ने विवरण सहित।`
          )
        : t(
            lang,
            "No volunteer opportunities are listed yet — /volunteer is where they'll appear. Community groups can post them free after registering.",
            "अहिलेसम्म कुनै स्वयंसेवा अवसर छैन — /volunteer मा देखिनेछ। समुदायिक संस्थाहरू दर्ता गरेपछि निःशुल्क राख्न सक्छन्।"
          ),
  },
  // --- Register / account ---
  {
    patterns: [/regist/i, /sign ?up/i, /join/i, /create.*account/i, /\baccount\b/i, /दर्ता/, /खाता/, /सदस्य/],
    reply: (_d, lang) =>
      t(
        lang,
        "Registering is free at /register. You'll give your name, email, phone, location and pick the topics you care about — then you can post jobs, rooms, events and businesses, and you'll get an email whenever a new listing matches your interests. Anything you post is checked by an admin before going live.",
        "/register मा निःशुल्क दर्ता गर्न सकिन्छ। नाम, इमेल, फोन, स्थान र रुचिका विषय दिनुहोस् — त्यसपछि जागिर, कोठा, कार्यक्रम र व्यवसाय राख्न सक्नुहुन्छ, र तपाईंको रुचि मिल्ने नयाँ सूची आएपछि इमेल आउनेछ। तपाईंले राखेको सामग्री प्रकाशित हुनु अघि एडमिनले जाँच्छ।"
      ),
  },
  // --- Posting ---
  {
    patterns: [/how.*(post|add|list|advertis)/i, /\bpost\b/i, /submit/i, /कसरी.*(राख|थप)/, /राख्न/, /\bkasari\b/i],
    reply: (_d, lang) =>
      t(
        lang,
        "Log in, then open the section you want (Jobs, Rooms, Events, Volunteer or Businesses) and use the 'Post' button at the top. Add photos and a link if you have them. An admin reviews it, and once approved it goes live and members with matching interests are emailed.",
        "लग इन गर्नुहोस्, त्यसपछि चाहेको खण्ड (Jobs, Rooms, Events, Volunteer वा Businesses) खोल्नुहोस् र माथिको 'Post' बटन प्रयोग गर्नुहोस्। फोटो र लिंक भए थप्नुहोस्। एडमिनले जाँचेपछि प्रकाशित हुन्छ, र रुचि मिल्ने सदस्यहरूलाई इमेल जान्छ।"
      ),
  },
  // --- Advertising ---
  {
    patterns: [/advertis/i, /sponsor/i, /promot/i, /\bprice|pricing|cost\b/i, /विज्ञापन/, /प्रचार/],
    reply: (_d, lang) =>
      t(
        lang,
        "You can advertise with us — featured business listings, event promotion, sponsored articles or homepage placement. Budgets start around £20 a month. Tell us what you'd like to promote on /advertise and you'll get options back.",
        "तपाईं हामीसँग विज्ञापन गर्न सक्नुहुन्छ — फिचर्ड व्यवसाय सूची, कार्यक्रम प्रचार, प्रायोजित लेख वा गृहपृष्ठमा स्थान। बजेट लगभग £20 प्रति महिनाबाट सुरु हुन्छ। /advertise मा के प्रचार गर्न चाहनुहुन्छ लेख्नुहोस्, विकल्पहरू पठाइनेछ।"
      ),
  },
  // --- News / blog ---
  {
    patterns: [/news/i, /blog/i, /article/i, /story|stories/i, /समाचार/, /लेख/, /ब्लग/],
    reply: (d, lang) => {
      if (d.latestArticles.length === 0) {
        return t(
          lang,
          "The News & Blog section is at /news — community updates, guides and stories. Nothing is published just yet.",
          "News & Blog खण्ड /news मा छ — समुदायका अपडेट, गाइड र कथाहरू। अहिलेसम्म कुनै लेख प्रकाशित भएको छैन।"
        );
      }
      const list = d.latestArticles.map((a) => `• ${a.title} (/news/${a.slug})`).join("\n");
      return t(
        lang,
        `Latest from our News & Blog:\n\n${list}\n\nEverything is at /news.`,
        `हाम्रो News & Blog बाट पछिल्ला:\n\n${list}\n\nसबै /news मा छ।`
      );
    },
  },
  // --- Game ---
  {
    patterns: [/game/i, /bagh.?chal/i, /tiger/i, /goat/i, /play/i, /leaderboard/i, /बाघचाल/, /खेल/, /बाघ/, /बाख्रा/],
    reply: (_d, lang) =>
      t(
        lang,
        "We have Bagh-Chal (Tigers & Goats) at /games/bagh-chal — the traditional Nepali board game. You can play either side against the computer, and registered members' scores go on the leaderboard.",
        "हामीसँग /games/bagh-chal मा बाघचाल छ — परम्परागत नेपाली खेल। कम्प्युटरसँग कुनै पनि पक्ष लिएर खेल्न सक्नुहुन्छ, र दर्ता भएका सदस्यको अंक लिडरबोर्डमा जान्छ।"
      ),
  },
  // --- Locations ---
  {
    patterns: [/\bwhere\b/i, /which (city|cities|town)/i, /\blondon\b/i, /manchester/i, /wolverhampton/i, /birmingham/i, /reading/i, /near me/i, /कहाँ/, /सहर/, /\bkaha\b/i],
    reply: (d, lang) =>
      d.activeLocations.length > 0
        ? t(
            lang,
            `Right now there are listings in: ${d.activeLocations.join(", ")}. Every section can be filtered by city — for example /jobs/in/london or /rooms/in/manchester.`,
            `अहिले यी स्थानमा सूचीहरू छन्: ${d.activeLocations.join(", ")}। प्रत्येक खण्ड सहर अनुसार छान्न सकिन्छ — उदाहरण /jobs/in/london वा /rooms/in/manchester।`
          )
        : t(
            lang,
            "We cover the whole UK — London, Manchester, Birmingham, Reading, Aldershot, Wolverhampton and more. Each section has city pages like /jobs/in/london.",
            "हामी सम्पूर्ण बेलायत समेट्छौं — लन्डन, म्यानचेस्टर, बर्मिङ्घम, रेडिङ, अल्डरशट, उल्भरहम्पटन र अन्य। प्रत्येक खण्डमा /jobs/in/london जस्ता सहर पृष्ठ छन्।"
          ),
  },
  // --- Contact / human ---
  {
    patterns: [/contact/i, /email/i, /phone/i, /speak.*(human|someone|person)/i, /support/i, /सम्पर्क/, /इमेल/, /फोन/],
    reply: (d, lang) =>
      t(
        lang,
        `You can reach the team through the form at /contact, or email ${d.contactEmail}. There's also a WhatsApp community group — the green button at the bottom of the page, once you're logged in.`,
        `/contact मा फर्म भरेर वा ${d.contactEmail} मा इमेल गरेर टिमसँग सम्पर्क गर्न सक्नुहुन्छ। WhatsApp समुदाय समूह पनि छ — लग इन गरेपछि पृष्ठको तल हरियो बटन।`
      ),
  },
  // --- About / founder ---
  {
    patterns: [/about/i, /who (are|runs|is behind)/i, /founder/i, /samir/i, /बारेमा/, /संस्थापक/, /समिर/],
    reply: (_d, lang) =>
      t(
        lang,
        "Nepali Community UK is a platform bringing the Nepali diaspora across the UK together — jobs, housing, events, businesses, volunteering and community news in one place. It was founded by Samir Khatiwada; there's more on /about and /founder.",
        "Nepali Community UK बेलायतभरका नेपाली समुदायलाई एकै ठाउँमा जोड्ने प्लेटफर्म हो — जागिर, आवास, कार्यक्रम, व्यवसाय, स्वयंसेवा र समुदायका समाचार। यसको स्थापना समिर खतिवडाले गर्नुभएको — /about र /founder मा थप छ।"
      ),
  },
  // --- Free / cost ---
  {
    patterns: [/\bfree\b/i, /charge/i, /\bfee\b/i, /pay\b/i, /निःशुल्क/, /शुल्क/, /पैसा/],
    reply: (_d, lang) =>
      t(
        lang,
        "Everything for community members is free — registering, browsing, and posting jobs, rooms, events, volunteering or your business. We only charge for optional advertising, which starts around £20 a month.",
        "समुदायका सदस्यहरूको लागि सबै निःशुल्क छ — दर्ता, हेर्न, र जागिर, कोठा, कार्यक्रम, स्वयंसेवा वा व्यवसाय राख्न। हामी वैकल्पिक विज्ञापनको मात्र शुल्क लिन्छौं, जो लगभग £20 प्रति महिनाबाट सुरु हुन्छ।"
      ),
  },
];

const GREETINGS = [/^\s*(hi|hello|hey|hiya|yo|good (morning|afternoon|evening))\b/i, /नमस्ते/, /^\s*namaste\b/i];

function greeting(data: GroundingData, lang: ChatLanguage): string {
  const total = totalListings(data);
  return t(
    lang,
    `Namaste! I can help you find your way around Nepali Community UK — jobs, rooms, events, businesses, volunteering, news, or how to register. There ${total === 1 ? "is" : "are"} currently ${total} listing${total === 1 ? "" : "s"} on the site. What are you looking for?`,
    `नमस्ते! Nepali Community UK मा बाटो देखाउन सक्छु — जागिर, कोठा, कार्यक्रम, व्यवसाय, स्वयंसेवा, समाचार, वा दर्ता कसरी गर्ने। अहिले साइटमा ${total} सूची छ${total === 1 ? "" : "न्"}। तपाईं के खोज्दै हुनुहुन्छ?`
  );
}

function fallback(data: GroundingData, lang: ChatLanguage): string {
  return t(
    lang,
    `I'm not sure I caught that. I can help with:\n\n• Jobs (${data.counts.JOB})\n• Rooms & housing (${data.counts.ROOM})\n• Events (${data.counts.EVENT})\n• Businesses (${data.counts.BUSINESS})\n• Volunteering (${data.counts.VOLUNTEER})\n• News & blog, registering, posting, or advertising\n\nAsk about any of those, or reach a person at ${data.contactEmail}.`,
    `मैले ठीक बुझिन जस्तो लाग्यो। मैले यसमा सहयोग गर्न सक्छु:\n\n• जागिर (${data.counts.JOB})\n• कोठा तथा आवास (${data.counts.ROOM})\n• कार्यक्रम (${data.counts.EVENT})\n• व्यवसाय (${data.counts.BUSINESS})\n• स्वयंसेवा (${data.counts.VOLUNTEER})\n• समाचार र ब्लग, दर्ता, पोस्ट गर्ने, वा विज्ञापन\n\nयीमध्ये कुनै बारे सोध्नुहोस्, वा ${data.contactEmail} मा मानिससँग सम्पर्क गर्नुहोस्।`
  );
}

export function getRuleBasedReply(
  message: string,
  data: GroundingData,
  lang: ChatLanguage
): string {
  if (GREETINGS.some((p) => p.test(message)) && message.trim().length < 30) {
    return greeting(data, lang);
  }

  for (const topic of TOPICS) {
    if (topic.patterns.some((p) => p.test(message))) {
      return topic.reply(data, lang);
    }
  }

  return fallback(data, lang);
}

/** Instructs a configured model to stay on-topic and answer in the chosen language. */
export function buildSystemPrompt(data: GroundingData, lang: ChatLanguage): string {
  const languageRule =
    lang === "ne"
      ? "Reply ONLY in Nepali (Devanagari script). Keep it natural and warm, not formal or translated-sounding."
      : "Reply ONLY in English. Keep it warm and plain — many readers are not native English speakers, so avoid jargon and long sentences.";

  return `You are the assistant for Nepali Community UK, a platform for the Nepali community across the United Kingdom.

${languageRule}

Live site data (use these real numbers, never invent figures):
- Jobs listed: ${data.counts.JOB}
- Rooms & housing listed: ${data.counts.ROOM}
- Events listed: ${data.counts.EVENT}
- Businesses listed: ${data.counts.BUSINESS}
- Volunteer opportunities listed: ${data.counts.VOLUNTEER}
- Cities with listings: ${data.activeLocations.join(", ") || "none yet"}
- Recent articles: ${data.latestArticles.map((a) => a.title).join("; ") || "none yet"}

Key pages: /jobs, /rooms, /events, /volunteer, /businesses, /news, /advertise, /register, /contact, /games/bagh-chal. City pages look like /jobs/in/london.

Facts: registering and posting are free; listings are reviewed by an admin before going live; members get email alerts when a new listing matches their interests; advertising starts around £20/month; the team can be reached at ${data.contactEmail}.

Rules: only answer questions about this site and living as a Nepali person in the UK. If you don't know something, say so and point to /contact — never guess at immigration, legal, medical or financial advice, and suggest a qualified professional for those. Keep answers under 120 words.`;
}
