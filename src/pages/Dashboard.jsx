import {
  ArrowUpRight, Bookmark, BriefcaseBusiness, CheckCircle2, ClipboardList,
  Code2, GraduationCap, Search, Sparkles, TrendingUp,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Empty, ErrorBox, Loading, Stat } from "../components/Common";
import { JobRow } from "../components/JobCards";

const COLORS = ["#4479F5", "#9B7CF6", "#20B98A", "#F4A261"];
const PIE_STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function Dashboard({
  jobs, saved, tracked, count, pie, filtered,
  loading, error, skills, apps,
  toggleSave, status, load, nav, setFresher,
}) {
  function findFresherJobs() {
    setFresher(true);
    nav("Find Jobs");
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} /> YOUR CAREER JOURNEY
          </div>
          <h1>
            Good things start <span>here.</span>
          </h1>
          <p className="muted">Find opportunities that fit your skills and ambitions.</p>
        </div>
        <button className="primary-button" onClick={() => nav("Find Jobs")}>
          <Search size={17} /> Explore jobs
        </button>
      </div>

      <section className="hero-banner">
        <div className="hero-copy">
          <span className="hero-pill">
            <GraduationCap size={14} /> MADE FOR FRESHERS
          </span>
          <h2>
            Your first job is a<br />
            journey worth taking.
          </h2>
          <p>Discover opportunities, track every application, and keep moving forward.</p>
          <button className="hero-button" onClick={findFresherJobs}>
            Find your opportunity <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="hero-illustration">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="floating-icon float-one"><Code2 /></div>
          <div className="floating-icon float-two"><TrendingUp /></div>
          <div className="floating-icon float-three"><GraduationCap /></div>
          <div className="hero-center">
            <BriefcaseBusiness size={42} />
          </div>
        </div>
      </section>

      <div className="section-heading">
        <h2>Your progress at a glance</h2>
        <p className="muted">A little progress goes a long way.</p>
      </div>

      <div className="stats-grid">
        <Stat icon={Search} label="Jobs discovered" value={jobs.length} color="blue" hint="Across connected sources" />
        <Stat icon={Bookmark} label="Saved jobs" value={saved.length} color="purple" hint="Worth another look" />
        <Stat icon={ClipboardList} label="Applications" value={tracked} color="orange" hint="Beyond the saved stage" />
        <Stat
          icon={CheckCircle2}
          label="Interviews & offers"
          value={count("Interview") + count("Offer")}
          color="green"
          hint={count("Offer") + " offer(s) tracked"}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recommended opportunities</h3>
              <p className="muted">Based on your selected preferences</p>
            </div>
            <button className="text-button" onClick={() => nav("Find Jobs")}>
              View all <ArrowUpRight size={15} />
            </button>
          </div>

          {loading ? (
            <Loading />
          ) : error && !jobs.length ? (
            <ErrorBox error={error} retry={() => load(true)} />
          ) : (
            <div className="recommend-list">
              {filtered.slice(0, 4).map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  skills={skills}
                  saved={saved.includes(job.id)}
                  onSave={() => toggleSave(job.id)}
                  onTrack={(s) => status(job.id, s)}
                  current={apps[job.id] || ""}
                />
              ))}
              {filtered.length === 0 && (
                <Empty title="No matching jobs yet" text="Try a different role or location in Find Jobs." />
              )}
            </div>
          )}
        </section>

        <section className="panel progress-panel">
          <div className="panel-heading">
            <div>
              <h3>Application overview</h3>
              <p className="muted">Your tracked application statuses</p>
            </div>
          </div>

          {pie.length > 0 ? (
            <>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie data={pie} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={4}>
                      {pie.map((item, i) => (
                        <Cell key={item.name} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-center">
                  <strong>{tracked}</strong>
                  <span>Tracked</span>
                </div>
              </div>

              <div className="legend-list">
                {PIE_STATUSES.map((label, i) => (
                  <div key={label}>
                    <span className="legend-dot" style={{ background: COLORS[i] }} />
                    {label}
                    <strong>{count(label)}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Empty title="Your journey starts here" text="Track a job application to see your progress." />
          )}

          <button className="secondary-button full-button" onClick={() => nav("Applications")}>
            Manage applications <ArrowUpRight size={15} />
          </button>
        </section>
      </div>

      <p className="footer-note">
        Listings come from external sources. Verify eligibility and details on the original employer listing.
      </p>
    </>
  );
}