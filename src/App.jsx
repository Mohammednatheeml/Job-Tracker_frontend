import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, Bookmark, BriefcaseBusiness, ClipboardList, GraduationCap,
  LayoutDashboard, Menu, Search, UserRound, X,
} from "lucide-react";
import { STATUSES } from "./components/Common";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import { getJobs, getMatchScore, isFresherFriendly } from "./lib/jobs";

const DEFAULT_PROFILE = {
  role: "Java Developer",
  location: "Chennai",
  experience: "Fresher",
  workMode: "Any",
  skills: "Java, Spring Boot, SQL, JavaScript, React, Apis",
};

const SAVED_JOBS_RESET_KEY = "cc.saved.reset-v1";

const NAV_ITEMS = [
  ["Dashboard", LayoutDashboard],
  ["Find Jobs", Search],
  ["Saved Jobs", Bookmark],
  ["Applications", ClipboardList],
  ["My Profile", UserRound],
];

// read from localStorage, fall back if empty or broken
function getStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialSavedJobs() {
  try {
    if (!localStorage.getItem(SAVED_JOBS_RESET_KEY)) {
      localStorage.setItem("cc.saved", JSON.stringify([]));
      localStorage.setItem(SAVED_JOBS_RESET_KEY, "true");
      return [];
    }
  } catch {
    return [];
  }
  return getStored("cc.saved", []);
}

// only prefill the search filters if the user changed the default profile
function initialFilter(field) {
  const p = getStored("cc.profile", DEFAULT_PROFILE);
  const changed = p.role !== DEFAULT_PROFILE.role || p.location !== DEFAULT_PROFILE.location;
  return changed ? p[field] : "";
}

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(false);

  // filters
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(() => initialFilter("role"));
  const [location, setLocation] = useState(() => initialFilter("location"));
  const [fresher, setFresher] = useState(true);
  const [workMode, setWorkMode] = useState("Any");
  const [sort, setSort] = useState("Relevant");

  // saved data
  const [profile, setProfile] = useState(() => getStored("cc.profile", DEFAULT_PROFILE));
  const [saved, setSaved] = useState(getInitialSavedJobs);
  const [apps, setApps] = useState(() => getStored("cc.apps", {}));

  const skills = useMemo(
    () => profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
    [profile.skills]
  );

  async function load(refresh = false) {
    setLoading(true);
    setError("");
    try {
      const data = await getJobs({ refresh });
      setJobs(data);
    } catch (err) {
      setError(err.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // save everything to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("cc.profile", JSON.stringify(profile));
      localStorage.setItem("cc.saved", JSON.stringify(saved));
      localStorage.setItem("cc.apps", JSON.stringify(apps));
    } catch {}
  }, [profile, saved, apps]);

  const filtered = useMemo(() => {
    let results = [...jobs];

    const terms = (query + " " + role).trim().toLowerCase().split(/\s+/).filter(Boolean);

    if (terms.length) {
      results = results.filter((job) => {
        const text = (
          job.title + " " + job.company + " " + job.location + " " + job.description + " " + job.tags.join(" ")
        ).toLowerCase();
        return terms.every((t) => text.includes(t));
      });
    }

    const place = location.trim().toLowerCase();
    if (place) {
      results = results.filter(
        (job) =>
          job.location.toLowerCase().includes(place) ||
          (job.remote && /worldwide|anywhere|all countries|global/i.test(job.location))
      );
    }

    if (fresher) results = results.filter(isFresherFriendly);
    if (workMode === "Remote") results = results.filter((job) => job.remote);
    if (workMode === "On-site") results = results.filter((job) => !job.remote);

    if (sort === "Best match") {
      results.sort((a, b) => getMatchScore(b, skills) - getMatchScore(a, skills));
    }
    if (sort === "Newest") {
      results.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }

    return results;
  }, [jobs, query, role, location, fresher, workMode, sort, skills]);

  const savedJobs = jobs.filter((job) => saved.includes(job.id));
  const entries = Object.entries(apps);

  const count = (s) => entries.filter(([, value]) => value === s).length;
  const tracked = entries.filter(([, value]) => value !== "Saved").length;

  const pie = STATUSES.slice(1)
    .map((name) => ({ name, value: count(name) }))
    .filter((item) => item.value);

  function toggleSave(id) {
    if (saved.includes(id)) {
      setSaved(saved.filter((x) => x !== id));
    } else {
      setSaved([...saved, id]);
    }
  }

  // set / remove the application status of a job
  function status(id, newStatus) {
    const next = { ...apps };
    if (newStatus) next[id] = newStatus;
    else delete next[id];
    setApps(next);

    // choosing "Saved" also bookmarks the job
    if (newStatus === "Saved" && !saved.includes(id)) {
      setSaved([...saved, id]);
    }
  }

  function nav(name) {
    setPage(name);
    setMobile(false);
  }

  function renderPage() {
    if (page === "Find Jobs") {
      return (
        <FindJobs
          loading={loading} load={load}
          query={query} setQuery={setQuery}
          role={role} setRole={setRole}
          location={location} setLocation={setLocation}
          workMode={workMode} setWorkMode={setWorkMode}
          sort={sort} setSort={setSort}
          fresher={fresher} setFresher={setFresher}
          filtered={filtered} error={error} jobs={jobs}
          skills={skills} saved={saved} apps={apps}
          toggleSave={toggleSave} status={status}
        />
      );
    }

    if (page === "Saved Jobs") {
      return (
        <SavedJobs
          jobs={savedJobs} skills={skills} saved={saved} apps={apps}
          toggleSave={toggleSave} status={status} nav={nav}
        />
      );
    }

    if (page === "Applications") {
      return <Applications entries={entries} count={count} jobs={jobs} status={status} nav={nav} />;
    }

    if (page === "My Profile") {
      return (
        <Profile
          profile={profile}
          setProfile={setProfile}
          onSave={() => {
            setRole(profile.role);
            setLocation(profile.location);
            setWorkMode(profile.workMode);
            nav("Find Jobs");
          }}
        />
      );
    }

    return (
      <Dashboard
        jobs={jobs} saved={saved} tracked={tracked} count={count} pie={pie}
        filtered={filtered} loading={loading} error={error}
        skills={skills} apps={apps}
        toggleSave={toggleSave} status={status}
        load={load} nav={nav} setFresher={setFresher}
      />
    );
  }

  return (
    <div className="app-shell">
      {mobile && <button className="mobile-overlay" onClick={() => setMobile(false)} aria-label="Close menu" />}

      <aside className={"sidebar " + (mobile ? "sidebar-open" : "")}>
        <div className="brand">
          <div className="brand-mark">
            <BriefcaseBusiness />
          </div>
          <div>
            <h2>Job-Tracker</h2>
            <span>YOUR NEXT CHAPTER</span>
          </div>
          <button className="icon-button close-menu" onClick={() => setMobile(false)} aria-label="Close">
            <X />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          {NAV_ITEMS.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => nav(name)}
              className={"nav-item " + (page === name ? "active" : "")}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Saved Jobs" && saved.length > 0 && <span className="nav-count">{saved.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="career-card">
            <div className="career-card-icon">
              <GraduationCap />
            </div>
            <strong>Your career, your pace.</strong>
            <p>Small steps today. Big opportunities tomorrow.</p>
            <button onClick={() => nav("My Profile")}>
              Update profile <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="profile-mini">
            <div className="avatar">CC</div>
            <div>
              <strong>Job Seeker</strong>
              <span>{profile.role || "Set your target role"}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMobile(true)} aria-label="Open menu">
            <Menu />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{page}</strong>
          </div>

          <div className="topbar-right">
            <span className="live-dot" />
            <span className="topbar-live">Job search workspace</span>
            <button className="avatar avatar-small" onClick={() => nav("My Profile")}>
              CC
            </button>
          </div>
        </header>

        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  );
}