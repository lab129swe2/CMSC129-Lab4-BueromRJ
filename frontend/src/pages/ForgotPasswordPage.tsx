import { ForgotPasswordCard } from "../components/ForgotPasswordCard";
import { PublicNavbar } from "../components/PublicNavbar";

export function ForgotPasswordPage() {
  return (
    <main className="min-h-dvh bg-base-200">
      <PublicNavbar />
      <section className="mx-auto flex max-w-md justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full">
          <ForgotPasswordCard />
        </div>
      </section>
    </main>
  );
}
