import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-black">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          PayPal AI Hackathon 2026 &bull; Bryntum Sponsor Track
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight hero-gradient-text">
          Freelance milestone escrow without payment anxiety
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Lock client budget into PayPal escrow upfront. Decompose the brief into objective tranches with AI. When the code passes automated inspection, get paid instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/wizard"
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-decelerate active:scale-95"
          >
            Create Escrow Contract
          </Link>
          <Link
            href="/demo"
            className="rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 px-6 py-3 text-base font-medium text-zinc-300 transition-decelerate"
          >
            Explore Interactive Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
