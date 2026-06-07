interface PageHeaderProps {
  label: string;
  title: string;
  sub?: string;
}

export default function PageHeader({ label, title, sub }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-medium tracking-[0.15em] uppercase text-rose-500 mb-2">{label}</p>
      <h1 className="font-serif text-3xl text-ink font-normal">{title}</h1>
      {sub && <p className="text-ink-soft mt-2 text-sm leading-relaxed">{sub}</p>}
    </div>
  );
}
