interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
}

export default function SectionHeading({ label, title, description, light }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="h-px w-12 bg-gold-500" />
        <span className={`text-xs tracking-widest uppercase font-semibold ${light ? "text-gold-400" : "text-gold-600"}`}>
          {label}
        </span>
        <span className="h-px w-12 bg-gold-500" />
      </div>
      <h2 className={`font-cormorant text-4xl md:text-5xl font-semibold mb-4 ${light ? "text-white" : "text-wood-700"}`}>
        {title}
      </h2>
      {description && (
        <p className={`max-w-2xl mx-auto text-base leading-relaxed ${light ? "text-wood-200" : "text-gray-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
