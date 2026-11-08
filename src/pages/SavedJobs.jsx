import { ArrowUpRight } from "lucide-react";
import { Empty, PageTitle } from "../components/Common";
import { JobGrid } from "../components/JobCards";

export default function SavedJobs({
  jobs,
  skills,
  saved,
  apps,
  toggleSave,
  status,
  nav,
}) {
  return (
    <>
      <PageTitle
        eyebrow="YOUR SHORTLIST"
        title="Saved opportunities."
        subtitle="Keep promising roles in one place while you decide your next step."
      />
      {jobs.length ? (
        <JobGrid
          jobs={jobs}
          skills={skills}
          savedIds={saved}
          apps={apps}
          toggleSave={toggleSave}
          status={status}
        />
      ) : (
        <section className="panel empty-wide">
          <Empty
            title="No saved jobs yet"
            text="Bookmark a listing to add it to your shortlist."
          />
          <button className="primary-button" onClick={() => nav("Find Jobs")}>
            Explore jobs <ArrowUpRight size={16} />
          </button>
        </section>
      )}
    </>
  );
}
