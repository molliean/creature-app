"use client";

import Image from "next/image";
import { useState } from "react";

type CoverImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Shown in the placeholder if both src and fallbackSrc fail. */
  placeholderTitle?: string;
  placeholderAuthor?: string;
};

export function CoverImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  priority,
  placeholderTitle,
  placeholderAuthor,
}: CoverImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

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
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
