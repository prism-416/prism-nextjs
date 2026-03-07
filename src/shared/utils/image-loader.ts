interface ImageLoaderProp {
  src: string;
  width: number;
  quality?: number;
}

/**
 * @description 이미지 로더
 * @param src
 * @param width
 * @param quality
 */
export function imageLoader({ src, width, quality }: ImageLoaderProp) {
  // 전체 URL 확인 및 기본 URL 추가
  const w = Math.min(width, 768);
  const url = `${src}?w=${w}&q=${quality || 75}`;
  return url;
}
