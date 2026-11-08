import { AlertCircle, BriefcaseBusiness, RefreshCw } from "lucide-react";

export const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export function Stat({ icon: Icon, label, value, color, hint }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={20} />
      </div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-hint">{hint}</span>
    </div>
  );
}

export function PageTitle({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-title-row">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function Loading() {
  return (
    <div className="panel loading-state">
      <div className="spinner" />
      <strong>Looking for opportunities</strong>
      <p className="muted">Connecting to public job sources...</p>
    </div>
  );
}

export function ErrorBox({ error, retry }) {
  return (
    <div className="panel error-state">
      <AlertCircle size={28} />
      <h3>Couldn't load job listings</h3>
      <p>{error}</p>
      <button className="secondary-button" onClick={retry}>
        <RefreshCw size={16} /> Try again
      </button>
    </div>
  );
}

export function Empty({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <BriefcaseBusiness size={25} />
      </div>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
