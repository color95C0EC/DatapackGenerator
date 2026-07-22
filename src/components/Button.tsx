// import { tv } from "tailwind-variants";
import { type ComponentProps } from "react";
import clsx from "clsx";


// const styles = tv({
//   base: "rounded"
// })

export type ButtonProps = {} & ComponentProps<"button">

//TODO: disabledのとき背景色,ホバー無し
export default function Button({
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // styles(),
        "bg-slate-500",
        "rounded",
        "px-1.5 py-1",
        "hover:bg-slate-700 hover:cursor-pointer",
        "disabled:cursor-not-allowed disabled:bg-gray-400"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
