import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Quorlyn Technology — software engineering, built to last";
export const size = ogSize;
export const contentType = ogContentType;

export default function TwitterImage() {
  return renderOgImage();
}
