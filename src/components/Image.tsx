import { HTMLAttributes, useState } from "react";

/**
 * Fades in when the image loads.
 *
 * TIP: Set `key` to the same value as `src` so the image re-fades in when `src`
 * changes.
 */
export function Image({
  className = "",
  ...props
}: HTMLAttributes<HTMLImageElement>) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <img
      {...props}
      className={`${className} image ${imageLoaded ? "" : "image-loading"}`}
      onLoad={() => setImageLoaded(true)}
    />
  );
}
