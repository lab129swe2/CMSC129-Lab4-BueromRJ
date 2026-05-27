import { AuthCard } from "../components/AuthCard";
import { TaskComposer } from "../components/TaskComposer";
import { TaskList } from "../components/TaskList";
import { PublicNavbar } from "../components/PublicNavbar";

const benefits = [
  {
    title: "Capture tasks quickly",
    description: "Create clear tasks with optional details in seconds.",
  },
  {
    title: "Track progress",
    description: "Move work from to do to completed as priorities shift.",
  },
  {
    title: "Keep it private",
    description: "Email and password authentication protects your own list.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-dvh bg-base-200">
      <PublicNavbar />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <span className="badge badge-primary badge-outline mb-5">Simple task management</span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-base-content sm:text-5xl">
            Organize today.
            <span className="block text-primary">Finish what matters.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-base-content/70">
            Create, prioritize, and complete tasks in a focused workspace built for daily progress.
          </p>
          <div className="mt-8 space-y-5">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-3">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-success" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5A1 1 0 015.704 9.29l2.793 2.793 6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="font-semibold">{benefit.title}</h2>
                  <p className="text-sm text-base-content/70">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AuthCard />
      </section>

      <section className="border-t border-base-300 bg-base-100/40 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Preview</p>
            <h2 className="mt-2 text-2xl font-semibold">A focused workspace for your tasks</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <TaskComposer preview />
            <TaskList preview onTaskChanged={() => undefined} />
          </div>
        </div>
      </section>
    </main>
  );
}
