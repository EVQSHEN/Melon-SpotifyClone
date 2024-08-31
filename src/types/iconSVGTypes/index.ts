import { SVG } from '@/components/IconSVG/IconSVG';
interface IconProps {
  name: keyof typeof SVG;
  onClick?: () => void;
  className?: string;
  height?: string;
  width?: string;
  viewBox?: string;
}

export type { IconProps };
