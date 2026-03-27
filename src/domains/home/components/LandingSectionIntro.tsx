type LandingSectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function LandingSectionIntro({
  eyebrow,
  title,
  description,
}: LandingSectionIntroProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-prism-teal-500">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-prism-navy md:text-4xl">{title}</h2>
      <p className="mt-5 text-pretty text-base leading-7 text-prism-muted md:text-lg">{description}</p>
    </div>
  );
}
