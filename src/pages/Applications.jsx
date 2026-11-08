import { ExternalLink, Search, X } from "lucide-react";
import { Empty, PageTitle, STATUSES } from "../components/Common";

export default function Applications({ entries, count, jobs, status, nav }) {
  return (
    <>
      <PageTitle
        eyebrow="YOUR CAREER PIPELINE"
        title="Application tracker."
        subtitle="Keep track of the opportunities you've decided to pursue."
        action={
          <button className="primary-button" onClick={() => nav("Find Jobs")}>
            <Search size={16} /> Find more jobs
          </button>
        }
      />

      <div className="tracker-summary">
        {STATUSES.slice(1).map((label) => (
          <div className="tracker-count" key={label}>
            <span>{label}</span>
            <strong>{count(label)}</strong>
          </div>
        ))}
      </div>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h3>Tracked opportunities</h3>
            <p className="muted">Change the status as you progress.</p>
          </div>
        </div>

        {entries.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>POSITION</th>
                  <th>COMPANY</th>
                  <th>STATUS</th>
                  <th>APPLICATION</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {entries.map(([id, current]) => {
                  const job = jobs.find((j) => j.id === id);

                  return (
                    <tr key={id}>
                      <td>
                        <strong>{job?.title || "Previously tracked job"}</strong>
                        <span className="table-sub">{job?.location || "Listing not currently loaded"}</span>
                      </td>
                      <td>{job?.company || "External listing"}</td>
                      <td>
                        <select
                          className={"status-select status-" + current.toLowerCase()}
                          value={current}
                          onChange={(e) => status(id, e.target.value)}
                        >
                          {STATUSES.map((label) => (
                            <option key={label}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {job?.url ? (
                          <a href={job.url} target="_blank" rel="noreferrer" className="table-link">
                            Open listing <ExternalLink size={13} />
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <button className="icon-button" title="Remove from tracker" onClick={() => status(id, "")}>
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="Your tracker is ready" text="Open a job and set its status to start tracking it." />
        )}
      </section>
    </>
  );
}