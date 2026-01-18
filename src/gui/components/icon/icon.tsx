import "./icon.css";
import { h } from "preact";
import type { SVGAttributes } from "preact";
import { IconSend } from "./icon-send.tsx";
import { IconEllipsis } from "./ellipsis.tsx";
import { IconEllipsisVertical } from "./ellipsis-vertical.tsx";

export type IconProps = Omit<SVGAttributes<SVGSVGElement>, "children"> & {
  icon: keyof typeof IconsMap;
};

export type IconsMap = (typeof IconsMap)[keyof typeof IconsMap];
export const IconsMap = {
  send: IconSend,
  ellipsis: IconEllipsis,
  "ellipsis-vertical": IconEllipsisVertical,
} as const;

export function Icon({ icon, ...props }: IconProps) {
  const Component = IconsMap[icon];
  if (!Component) throw new Error(`Component "${icon}" does not exist`);
  return <Component {...props} />;
}
