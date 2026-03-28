"use client";

import { SoftAurora } from "@/atomics/atoms/SoftAurora";
import { cn } from "@/shared/utils/cn";

type AuthVisualBackdropProps = {
  withAurora?: boolean;
};

export function AuthVisualBackdrop({ withAurora = true }: AuthVisualBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-(image:--gradient-auth-backdrop)" />
      {withAurora && (
        <div className="absolute inset-0 opacity-45 mix-blend-screen">
          <SoftAurora
            color1="#f4ecd6"
            color2="#78c4d4"
            speed={0.35}
            scale={1.1}
            brightness={0.7}
            noiseFrequency={1.8}
            noiseAmplitude={0.7}
            bandHeight={0.62}
            bandSpread={1.6}
            octaveDecay={0.55}
            layerOffset={0.8}
            colorSpeed={0.45}
            mouseInfluence={0.08}
          />
        </div>
      )}
      <div
        className={cn(
          "absolute inset-0",
          withAurora ? "bg-(image:--gradient-auth-highlight-aurora)" : "bg-(image:--gradient-auth-highlight-static)",
        )}
      />
      <div className="absolute inset-y-12 left-12 w-px bg-white/12" />
      <div className="absolute right-[-8%] top-20 h-64 w-64 rounded-full bg-prism-cream/10 blur-3xl" />
      <div className="absolute bottom-16 right-20 h-40 w-40 rounded-full border border-white/10" />
    </div>
  );
}
