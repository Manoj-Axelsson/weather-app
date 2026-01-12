

import WeatherComponent from "@/components/weather-component";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <br />
        <br />
        <WeatherComponent />
        <br />
        <br />
        <br />
        <br />
        <footer className="mt-12 w-full rounded-xl border border-black bg-white/5 py-4 px-8 text-center text-xs tracking-wide text-black/75 shadow-sm backdrop-blur-md dark:border-white/50 dark:text-white/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-2">
            <span>Bearing Weather System [v1.0] - Designed for planning ahead!</span>
            <span className="opacity-70 sm:text-center">&copy; {new Date().getFullYear()} Manoj Axelsson Consulting AB</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
