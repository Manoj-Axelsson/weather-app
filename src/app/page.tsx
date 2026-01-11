import WeatherComponent from "@/components/weather-component";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <WeatherComponent />

        <footer className="mt-12 flex w-full items-center justify-center rounded-xl border border-black bg-white/5 py-4 px-6 text-center text-sm font-bold tracking-tight text-black/560 shadow-sm backdrop-blur-md dark:border-white/50 dark:text-white/60">
          &copy; {new Date().getFullYear()} Bearing Weather System.
          <br />
          All rights reserved &mdash; Manoj Axelsson Consulting AB
        </footer>
      </main>
    </div>
  );
}
