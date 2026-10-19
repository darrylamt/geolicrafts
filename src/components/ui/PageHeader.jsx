export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-page">
        <div className="max-w-3xl animate-fade-up">
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="text-5xl md:text-7xl leading-[0.95] text-stone-900">{title}</h1>
          {description && (
            <p className="mt-6 text-lg text-stone-500 leading-relaxed max-w-xl">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
