"use client";

import Image from "next/image";
import { useState } from "react";
import { GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { image: 32, text: "text-lg" },
  md: { image: 48, text: "text-xl" },
  lg: { image: 64, text: "text-2xl" },
};

export function BrandLogo({
  className,
  showText = true,
  size = "md",
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);
  const dimensions = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {!imageError ? (
        <Image
          src="/logo.png"
          alt="ITS Educação"
          width={dimensions.image}
          height={dimensions.image}
          className="object-contain"
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="size-7" />
        </div>
      )}
      {showText && (
        <div>
          <p className={cn("font-semibold tracking-tight", dimensions.text)}>
            ITS Educação
          </p>
          <p className="text-sm text-muted-foreground">
            Cursos médicos de excelência
          </p>
        </div>
      )}
    </div>
  );
}
