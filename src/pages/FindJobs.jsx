import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { Empty, ErrorBox, Loading, PageTitle } from "../components/Common";
import { JobGrid } from "../components/JobCards";

export default function FindJobs({
  loading, load,
  query, setQuery,
  role, setRole,
  location, setLocation,
  workMode, setWorkMode,
  sort, setSort,
  fresher, setFresher,
  filtered, error, jobs,
  skills, saved, apps,
  toggleSave, status,
}) {
  function clearFilters() {
    setQuery("");
    setRole("");
    setLocation("");
    setFresher(false);
    setWorkMode("Any");
  }

  return (
    <>
      <PageTitle
        eyebrow="OPPORTUNITY EXPLORER"
        title="Find your next role."
        subtitle="Explore opportunities that align with your skills, goals, and preferred location."
        action={
          <button className="secondary-button" disabled={loading} onClick={() => load(true)}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh jobs
          </button>
        }
      />

      <section className="filter-panel">
        <div className="search-main">
          <Search size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Additional keywords: company, skills, title..."
          />
          <button className="primary-button" onClick={() => setQuery(query.trim())}>
            Search
          </button>
        </div>

        <div className="filter-grid">
          <label>
            Target role
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Java Developer" />
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Leave blank for any location"
            />
          </label>

          <label>
            Work mode
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
              <option>Any</option>
              <option>Remote</option>
              <option>On-site</option>
            </select>
          </label>

          <label>
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>Relevant</option>
              <option>Best match</option>
              <option>Newest</option>
            </select>
          </label>
        </div>

        <label className="check-filter">
          <input type="checkbox" checked={fresher} onChange={(e) => setFresher(e.target.checked)} />
          <span>Prioritize fresher-friendly listings</span>
          <span className="filter-hint">Estimated from job text</span>
        </label>
      </section>

      <div className="results-heading">
        <div>
          <h2>{loading ? "Finding opportunities..." : filtered.length + " matching opportunities"}</h2>
          <p className="muted">Results from connected public job sources</p>
        </div>
        <div className="result-tag">
          <SlidersHorizontal size={15} /> Filters active
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error && !jobs.length ? (
        <ErrorBox error={error} retry={() => load(true)} />
      ) : filtered.length > 0 ? (
        <JobGrid
          jobs={filtered}
          skills={skills}
          savedIds={saved}
          apps={apps}
          toggleSave={toggleSave}
          status={status}
        />
      ) : (
        <div className="panel empty-wide">
          <Empty
            title="No matching jobs found"
            text="Try a broader role, clear the location, or turn off the fresher filter."
          />
          <button className="secondary-button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}

      <p className="footer-note">
        Freshers eligibility is estimated from listing text. Remotive lists remote roles; public API coverage and
        availability vary.
      </p>
    </>
  );
}