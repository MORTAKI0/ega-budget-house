export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h1>
      {description ? <p className="text-sm text-zinc-600">{description}</p> : null}
    </header>
  );
}
