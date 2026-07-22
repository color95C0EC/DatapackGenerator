import type { ReactNode } from "react";
import { type ComponentProps } from "react";


export type SelectProps = {} & ComponentProps<"select">

export function Select({
  ...rest
}: SelectProps) {
  return (
    <select {...rest}></select>
  );
}


export type SelectItemProps = {
  label: ReactNode
} & ComponentProps<"option">

export function SelectItem({
  label,
  ...rest
}: SelectItemProps) {
  return (
    <option {...rest}>{label}</option>
  );
}
