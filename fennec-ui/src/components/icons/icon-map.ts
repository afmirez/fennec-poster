import MoonIcon from "./MoonIcon";
import SunIcon from "./SunIcon";
import type { IconKey } from "@/types/icon-keys.type";

const iconMap: Record<
  IconKey,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  moon: MoonIcon,
  sun: SunIcon,
};

export default iconMap;
