"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type CoverImageProps = {
  src: string;
  fallbackSrc?: string;
  lastResortSrc?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Shown in the placeholder if all sources fail. */
  placeholderTitle?: string;
  placeholderAuthor?: string;
};

export function CoverImage({
  src,
  fallbackSrc,
  lastResortSrc,
  alt,
  sizes,
  priority,
  placeholderTitle,
  placeholderAuthor,
}: CoverImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);
  // Keep track of which sources we've already tried so we advance through the chain correctly
  const tried = useRef(new Set<string>());

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#8B9DAA] p-4 text-center">
        {placeholderTitle && (
          <p className="font-ligconsolata text-[13px] font-bold leading-tight text-white">
            {placeholderTitle}
          </p>
        )}
        {placeholderAuthor && (
          <p className="font-ligconsolata text-[11px] leading-tight text-white/75">
            {placeholderAuthor}
          </p>
        )}
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      style={{ objectFit: "cover" }}
      sizes={sizes}
      priority={priority}
      onError={() => {
        tried.current.add(imgSrc);
        const next = [fallbackSrc, lastResortSrc].find(
          (s) => s && !tried.current.has(s)
        );
        if (next) {
          setImgSrc(next);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
