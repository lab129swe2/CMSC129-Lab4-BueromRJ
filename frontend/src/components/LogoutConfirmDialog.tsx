import { ConfirmDialog } from "./ConfirmDialog";

type LogoutConfirmDialogProps = {
  open: boolean;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmDialog({ open, pending, onCancel, onConfirm }: LogoutConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="Log out of Taski?"
      description="You will need to sign in again to access your tasks."
      confirmLabel="Log Out"
      confirmClassName="btn-error"
      pending={pending}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
