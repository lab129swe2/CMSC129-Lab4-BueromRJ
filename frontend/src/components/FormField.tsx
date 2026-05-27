import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  helper?: ReactNode;
  required?: boolean;
};

export function FormField({ label, children, helper, required = false }: FormFieldProps) {
  return (
    <label className="form-control w-full gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-base-content/70">
          {label}
          {required ? (
            <>
              <span aria-hidden="true" className="ml-1 text-error">*</span>
              <span className="sr-only"> required</span>
            </>
          ) : null}
        </span>
        {helper ? <span className="text-xs text-base-content/60">{helper}</span> : null}
      </div>
      {children}
    </label>
  );
}
