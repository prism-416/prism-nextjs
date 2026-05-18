import { Typography } from "@/atomics/atoms/Typography";

type LandingSectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function LandingSectionIntro({ eyebrow, title, description }: LandingSectionIntroProps) {
  return (
    <div className="max-w-2xl">
      <Typography
        variant="overline"
        tone="inherit"
        weight="medium"
        className="text-prism-teal-500"
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h2"
        tone="inherit"
        wrap="balance"
        className="mt-4 text-[2rem] text-prism-navy sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3rem]"
      >
        {title}
      </Typography>
      <Typography
        variant="body"
        tone="muted"
        wrap="pretty"
        fontSize="lg"
        lineHeight="7"
        className="mt-4 md:mt-5 md:text-lg"
      >
        {description}
      </Typography>
    </div>
  );
}
