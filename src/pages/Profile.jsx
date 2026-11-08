import { AlertCircle, ArrowUpRight, UserRound } from "lucide-react";
import { PageTitle } from "../components/Common";

export default function Profile({ profile, setProfile, onSave }) {
  return (
    <>
      <PageTitle
        eyebrow="PERSONALIZE YOUR SEARCH"
        title="Your job preferences."
        subtitle="Tune your target role, location, work mode, and skills to improve recommendations."
      />
      <section className="panel profile-form">
        <div className="form-intro">
          <div className="profile-avatar-large">
            <UserRound size={30} />
          </div>
          <div>
            <h3 className="career-profile">Career profile</h3>
            <p className="muted">Your preferences stay in this browser.</p>
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <div className="form-grid">
            <label>
              Target job role
              <input
                value={profile.role}
                onChange={(event) =>
                  setProfile({ ...profile, role: event.target.value })
                }
                placeholder="Java Developer"
              />
            </label>
            <label>
              Preferred location
              <input
                value={profile.location}
                onChange={(event) =>
                  setProfile({ ...profile, location: event.target.value })
                }
                placeholder="Chennai, India"
              />
            </label>
            <label>
              Experience level
              <select
                value={profile.experience}
                onChange={(event) =>
                  setProfile({ ...profile, experience: event.target.value })
                }
              >
                <option>Fresher</option>
                <option>Internship</option>
                <option>0–2 years</option>
                <option>Experienced</option>
              </select>
            </label>
            <label>
              Work preference
              <select
                value={profile.workMode}
                onChange={(event) =>
                  setProfile({ ...profile, workMode: event.target.value })
                }
              >
                <option>Any</option>
                <option>Remote</option>
                <option>On-site</option>
              </select>
            </label>
            <label className="span-two">
              Skills, separated by commas
              <textarea
                rows="4"
                value={profile.skills}
                onChange={(event) =>
                  setProfile({ ...profile, skills: event.target.value })
                }
                placeholder="Java, SQL, Spring Boot, React..."
              />
            </label>
          </div>
          <div className="profile-tip">
            <AlertCircle size={17} />
            <span>
              Match scores compare your entered skills with listing text. They
              are keyword estimates, not hiring predictions.
            </span>
          </div>
          <button type="submit" className="primary-button">
            Save preferences & find jobs <ArrowUpRight size={16} />
          </button>
        </form>
      </section>
    </>
  );
}
