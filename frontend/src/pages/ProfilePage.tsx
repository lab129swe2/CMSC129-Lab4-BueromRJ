import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../auth/AuthProvider";
import { firebaseAuth } from "../auth/firebase";
import { Avatar } from "../components/Avatar";
import { FormField } from "../components/FormField";
import { LogoutConfirmDialog } from "../components/LogoutConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { getFriendlyErrorMessage } from "../utils/errorMessages";

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!user || !displayName.trim()) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      refreshProfile();
      setSuccess("Your display name has been updated.");
    } catch (caught) {
      setError(getFriendlyErrorMessage(caught, "Unable to update your profile. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await firebaseAuth.signOut();
    } finally {
      setLoggingOut(false);
      setConfirmingLogout(false);
    }
  }

  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Profile Settings"
          description="Manage how your account appears inside Taski."
        />

        <div className="space-y-5">
          <SectionCard>
            <div className="card-body gap-6 p-5 sm:p-6">
              <div className="flex flex-col items-center gap-4 border-b border-base-300 pb-6 sm:flex-row">
                <Avatar user={user} size="lg" />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold">{user?.displayName || "Taski user"}</h2>
                  <p className="text-sm text-base-content/70" title={user?.email || undefined}>{user?.email}</p>
                </div>
              </div>

              <FormField label="Display Name" required>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </FormField>

              {success ? <div role="status" className="alert alert-success text-sm">{success}</div> : null}
              {error ? <div role="alert" className="alert alert-error text-sm">{error}</div> : null}

              <div className="card-actions justify-end">
                <button type="button" className="btn btn-primary" disabled={saving || !displayName.trim()} onClick={() => void handleSave()}>
                  {saving ? <span className="loading loading-spinner loading-sm" /> : null}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="card-body gap-4 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold">Account Actions</h2>
                <p className="mt-1 text-sm text-base-content/70">Securely end your session on this device.</p>
              </div>
              <div>
                <button type="button" className="btn btn-outline btn-error" onClick={() => setConfirmingLogout(true)}>
                  Log Out
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <LogoutConfirmDialog
        open={confirmingLogout}
        pending={loggingOut}
        onCancel={() => setConfirmingLogout(false)}
        onConfirm={() => void handleLogout()}
      />
    </main>
  );
}
