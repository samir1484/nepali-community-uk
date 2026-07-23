const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("node:crypto");

const DATABASE_URL =
  process.env.DIRECT_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

// Local dev seed only — this password is public (it's in git). Change it (or the
// admin's password via the database) before this ever points at a real deployment.
const ADMIN_EMAIL = "admin@nepalicommunity.uk";
const ADMIN_PASSWORD = "AdminPass123!";

const HIGHLIGHTS = [
  {
    title: "Jobs & Careers",
    caption: "Find and post job opportunities within the community.",
  },
  {
    title: "Rooms & Housing",
    caption: "Browse room listings shared by fellow community members.",
  },
  {
    title: "Events & Festivals",
    caption: "Stay up to date with Nepali cultural events across the UK.",
  },
  {
    title: "Business Directory",
    caption: "Discover and support Nepali-owned businesses.",
  },
];

const SHOWCASE = [
  {
    title: "The Himalayas",
    caption: "Home to eight of the world's ten highest peaks, including Sagarmatha.",
    imageUrl: "/images/culture/mountains.jpg",
  },
  {
    title: "The Gurkha Khukuri",
    caption: "A symbol of Gurkha courage and centuries of proud military tradition.",
    imageUrl: "/images/culture/khukuri.webp",
  },
  {
    title: "Sacred Stupas",
    caption: "Boudhanath and Swayambhunath stand among the world's holiest Buddhist sites.",
    imageUrl: "/images/culture/stupa.gif",
  },
  {
    title: "Festivals & Tradition",
    caption: "From Dashain to Tihar, celebrations that bring the community together.",
    imageUrl: "/images/culture/festival.jpg",
  },
  {
    title: "Sacred Temples",
    caption: "Pashupatinath and countless other temples anchor Nepal's spiritual life.",
    imageUrl: "/images/culture/temple.jpg",
  },
  {
    title: "Living Culture",
    caption: "Traditions like the Kumari carry Nepal's heritage into every generation.",
    imageUrl: "/images/culture/tradition.jpg",
  },
];

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await client.query(
    `INSERT INTO users (id, name, email, "passwordHash", role, "userType", interests, "createdAt", "updatedAt")
     VALUES ($1, 'Site Admin', $2, $3, 'ADMIN', 'OTHER', '{}', now(), now())
     ON CONFLICT (email) DO UPDATE SET role = 'ADMIN', "passwordHash" = EXCLUDED."passwordHash"`,
    [randomUUID(), ADMIN_EMAIL, passwordHash]
  );
  console.log(`Admin user ready: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  const { rows: existing } = await client.query(`SELECT count(*)::int AS count FROM home_sections`);
  if (existing[0].count > 0) {
    console.log(`Skipping section seed — ${existing[0].count} home_sections rows already exist.`);
  } else {
    for (let i = 0; i < HIGHLIGHTS.length; i++) {
      const item = HIGHLIGHTS[i];
      await client.query(
        `INSERT INTO home_sections (id, type, title, caption, "order", "isActive", "createdAt", "updatedAt")
         VALUES ($1, 'HIGHLIGHT', $2, $3, $4, true, now(), now())`,
        [randomUUID(), item.title, item.caption, i]
      );
    }
    for (let i = 0; i < SHOWCASE.length; i++) {
      const item = SHOWCASE[i];
      await client.query(
        `INSERT INTO home_sections (id, type, title, caption, "imageUrl", "order", "isActive", "createdAt", "updatedAt")
         VALUES ($1, 'SHOWCASE', $2, $3, $4, $5, true, now(), now())`,
        [randomUUID(), item.title, item.caption, item.imageUrl, i]
      );
    }
    console.log(`Seeded ${HIGHLIGHTS.length} highlight + ${SHOWCASE.length} showcase sections.`);
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
