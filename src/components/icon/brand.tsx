import { h } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";
import type { IconProps } from "./icon.tsx";

export function IconBrand({ className, ...props }: Omit<IconProps, "icon">) {
  return (
    <svg
      className={classNames(
        "component-icon",
        "component-icon-brand",
        className,
      )}
      viewBox="0 0 640 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_209_3)">
        <circle cx="320" cy="320" r="320" fill="#111111" />
        <path
          d="M476.457 455.423L553.274 322.825L525.052 322.56L476.457 406.427L294.6 94L86.2847 453.658L114.507 453.923L294.6 143.084L476.457 455.423ZM163.102 416.491H191.413L294.953 237.722L474.34 545.912L503.003 546L295.041 188.814L163.102 416.491Z"
          fill="#E0E0E0"
        />
      </g>
      <defs>
        <clipPath id="clip0_209_3">
          <rect width="640" height="640" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
