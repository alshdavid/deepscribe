import { h } from "preact";
import { classNames } from "../../../platform/preact/class-names.ts";
import type { IconProps } from "./icon.tsx";

export function IconSend({ className, ...props }: Omit<IconProps, "icon">) {
  return (
    <svg
      className={classNames("component-icon", "component-icon-send", className)}
      viewBox="0 0 576 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path
          d="M9.46378 52.2736L95.8722 256.91L9.46378 461.547C3.94834 474.558 6.91818 489.69 16.9591 499.731C27.3535 510.125 43.1221 512.883 56.4864 506.59L533.642 281.164C543.047 276.709 548.916 267.305 548.986 256.91C549.057 246.516 543.047 237.111 533.642 232.657L56.4157 7.16018C43.0514 0.866939 27.2829 3.62464 16.8884 14.0191C6.84749 24.06 3.87765 39.1921 9.39307 52.2029L9.46378 52.2736Z"
          fill="inherit"
        />
      </g>
    </svg>
  );
}
