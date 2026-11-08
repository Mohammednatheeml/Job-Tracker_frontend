const CACHE = "careercompass.jobs.v1";
const TTL = 6 * 60 * 60 * 1000;
const clean = (s) =>
  String(s || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

function normalizeArbeit(j) {
  return {
    id: `arbeitnow-${j.slug || j.url}`,
    title: j.title || "Untitled role",
    company: j.company_name || "Company not listed",
    location: j.location || "Location not specified",
    remote: Boolean(j.remote),
    tags: Array.isArray(j.tags) ? j.tags : [],
    type: Array.isArray(j.job_types) ? j.job_types.join(", ") : "",
    description: clean(j.description),
    url: j.url || "",
    date: j.created_at
      ? new Date(Number(j.created_at) * 1000).toISOString()
      : "",
    source: "Arbeitnow",
  };
}
function normalizeRemotive(j) {
  return {
    id: `remotive-${j.id}`,
    title: j.title || "Untitled role",
    company: j.company_name || "Company not listed",
    location: j.candidate_required_location || "Remote",
    remote: true,
    tags: [j.category, j.job_type].filter(Boolean),
    type: j.job_type || "",
    description: clean(j.description),
    url: j.url || "",
    date: j.publication_date || "",
    source: "Remotive",
  };
}
export function isFresherFriendly(job) {
  const title = job.title.toLowerCase();
  if (
    /\b(senior|staff engineer|principal|tech lead|team lead|head of|director)\b/.test(
      title,
    )
  )
    return false;
  const text = `${title} ${job.description} ${job.tags.join(" ")}`;
  return /\b(fresher|entry.level|junior|graduate|new grad|intern(ship)?|trainee|apprentice|campus hire|0\s*(to|-|–)\s*2 years?|no experience required)\b/i.test(
    text,
  );
}
export function getMatchScore(job, skills = []) {
  const text =
    `${job.title} ${job.description} ${job.tags.join(" ")}`.toLowerCase();
  const list = [
    ...new Set(skills.map((s) => s.trim().toLowerCase()).filter(Boolean)),
  ];
  return list.length
    ? Math.round(
        (list.filter((s) => text.includes(s)).length / list.length) * 100,
      )
    : 0;
}
export async function getJobs({ refresh = false } = {}) {
  if (!refresh) {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE));
      if (c && Array.isArray(c.jobs) && Date.now() - c.time < TTL)
        return c.jobs;
    } catch {}
  }
  const sources = [
    fetch("https://www.arbeitnow.com/api/job-board-api").then(async (r) => {
      if (!r.ok) throw Error("Arbeitnow unavailable");
      const d = await r.json();
      return (d.data || []).map(normalizeArbeit);
    }),
    fetch("https://remotive.com/api/remote-jobs?limit=100").then(async (r) => {
      if (!r.ok) throw Error("Remotive unavailable");
      const d = await r.json();
      return (d.jobs || []).map(normalizeRemotive);
    }),
  ];
  const settled = await Promise.allSettled(sources);
  const jobs = settled
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((j) => j.url);
  const unique = [...new Map(jobs.map((j) => [j.id, j])).values()];
  if (!unique.length)
    throw Error(
      "Job sources could not be reached. Check your internet connection and try again.",
    );
  try {
    localStorage.setItem(
      CACHE,
      JSON.stringify({ time: Date.now(), jobs: unique }),
    );
  } catch {}
  return unique;
}



let fruits = [1,2,3,4,5];