export default function ComingSoon({ title, phase, description }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">{description}</p>
      <p className="mt-4 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
        {phase}
      </p>
    </div>
  );
}
