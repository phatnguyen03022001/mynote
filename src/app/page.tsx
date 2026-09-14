export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16 sm:px-10">
      <div className="max-w-xl space-y-5">
        <p className="text-sm font-medium text-muted-foreground">Personal inbox for thoughts, links, and snippets</p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">MyNote</h1>
        <p className="text-2xl tracking-tight text-foreground">Capture first. Organize later.</p>
        <p className="max-w-lg text-base leading-7 text-muted-foreground">
          A keyboard-first place to save what matters without turning note-taking into another system to maintain.
        </p>
      </div>
    </main>
  );
}
