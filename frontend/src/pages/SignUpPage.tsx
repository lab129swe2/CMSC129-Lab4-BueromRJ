import { PublicNavbar } from "../components/PublicNavbar";
import { SignUpCard } from "../components/SignUpCard";

export function SignUpPage() {
  return (
    <main className="min-h-dvh bg-base-200">
      <PublicNavbar />
      <section className="mx-auto flex max-w-md justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full">
          <SignUpCard />
        </div>
      </section>
    </main>
  );
}
