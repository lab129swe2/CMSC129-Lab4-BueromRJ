import { useEffect, useId } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmClassName?: string;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  confirmClassName = "btn-error",
  pending = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onCancel();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel, open, pending]);

  if (!open) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="modal-box max-w-sm">
        <h3 id={titleId} className="text-lg font-semibold">
          {title}
        </h3>
        <p className="py-4 text-sm text-base-content/70">{description}</p>
        <div className="modal-action">
          <button type="button" autoFocus className="btn btn-ghost" disabled={pending} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={`btn ${confirmClassName}`} disabled={pending} onClick={onConfirm}>
            {pending ? <span className="loading loading-spinner loading-sm" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
      <button type="button" className="modal-backdrop" aria-label="Cancel confirmation" onClick={onCancel} />
    </div>
  );
}
