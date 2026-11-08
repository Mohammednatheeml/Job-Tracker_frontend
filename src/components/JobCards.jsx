import {
  Bookmark,
  Clock3,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { getMatchScore } from "../lib/jobs";
import { STATUSES } from "./Common";

function Meta({ job }) {
  const date =
    job.date && !Number.isNaN(new Date(job.date).getTime())
      ? new Date(job.date).toLocaleDateString()
      : "Date not listed";
  return (
    <div className="job-meta">
      <span>
        <MapPin size={14} />
        {job.location}
      </span>
      <span>
        <Clock3 size={14} />
        {date}
      </span>
    </div>
  );
}

function Match({ job, skills }) {
  const score = getMatchScore(job, skills);
  const level = score >= 60 ? "high" : score >= 30 ? "mid" : "low";
  return (
    <span className={`match-badge match-${level}`}>
      <Sparkles size={13} /> {score}% skill match
    </span>
  );
}

function StatusSelect({ current, onTrack }) {
  return (
    <select
      aria-label="Application status"
      className="compact-status"
      value={current}
      onChange={(event) => onTrack(event.target.value)}
    >
      <option value="">Track...</option>
      {STATUSES.map((status) => (
        <option key={status}>{status}</option>
      ))}
    </select>
  );
}

export function JobRow({ job, skills, saved, onSave, onTrack, current }) {
  return (
    <div className="job-row">
      <div className="company-avatar">{job.company.slice(0, 1).toUpperCase()}</div>
      <div className="job-row-main">
        <strong>{job.title}</strong>
        <span>{job.company}</span>
        <Meta job={job} />
        <div className="tag-list">
          {job.remote && <span className="job-tag remote-tag">Remote</span>}
          <span className="job-tag">{job.source}</span>
          <Match job={job} skills={skills} />
        </div>
      </div>
      <div className="row-actions">
        <button
          className={`icon-button ${saved ? "is-saved" : ""}`}
          onClick={onSave}
          title="Save job"
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
        <a
          className="row-open"
          href={job.url}
          target="_blank"
          rel="noreferrer"
          title="Original listing"
        >
          <ExternalLink size={16} />
        </a>
        <StatusSelect current={current} onTrack={onTrack} />
      </div>
    </div>
  );
}

export function JobCard({ job, skills, saved, onSave, onTrack, current }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-avatar company-avatar-lg">
          {job.company.slice(0, 1).toUpperCase()}
        </div>
        <button
          className={`icon-button ${saved ? "is-saved" : ""}`}
          onClick={onSave}
          title={saved ? "Remove saved job" : "Save job"}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="job-source">
        {job.source}
        {job.remote && <span className="job-tag remote-tag">Remote</span>}
      </div>
      <h3>{job.title}</h3>
      <p className="company-name">{job.company}</p>
      <Meta job={job} />
      <div className="tag-list">
        {job.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="job-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="job-card-bottom">
        <Match job={job} skills={skills} />
        <StatusSelect current={current} onTrack={onTrack} />
      </div>
      <a className="apply-link" href={job.url} target="_blank" rel="noreferrer">
        View original listing <ExternalLink size={15} />
      </a>
    </article>
  );
}

export function JobGrid({ jobs, skills, savedIds, apps, toggleSave, status }) {
  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          skills={skills}
          saved={savedIds.includes(job.id)}
          onSave={() => toggleSave(job.id)}
          onTrack={(nextStatus) => status(job.id, nextStatus)}
          current={apps[job.id] || ""}
        />
      ))}
    </div>
  );
}
