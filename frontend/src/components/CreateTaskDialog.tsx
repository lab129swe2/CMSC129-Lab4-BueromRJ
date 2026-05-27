import { useEffect } from "react";
import { TaskComposer } from "./TaskComposer";

type CreateTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateTaskDialog({ open, onClose, onCreated }: CreateTaskDialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-label="Create task">
      <div className="modal-box max-w-2xl p-6 sm:p-7">
        <TaskComposer
          contained={false}
          autoFocusTitle
          onCancel={onClose}
          onAdd={() => {
            onCreated();
            onClose();
          }}
        />
      </div>
      <button type="button" className="modal-backdrop" aria-label="Close create task form" onClick={onClose} />
    </div>
  );
}
