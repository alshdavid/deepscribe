import "./button.css";
import { h, type ButtonHTMLAttributes } from "preact";
import { classNames } from "../../../platform/preact/class-names.ts";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {};

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button {...props} className={classNames("component-button", className)} />
  );
}
