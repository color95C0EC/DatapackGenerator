import { Field, type FieldInputProps } from "@ark-ui/react/field";
import clsx from "clsx/lite";
import { type ReactNode } from "react";


export type TextInputProps = {
  label?: ReactNode
  requiredText?: ReactNode
  errorText?: ReactNode
  helperText?: ReactNode
} & FieldInputProps;

//MEMO: 固定幅 テキスト折り返し
export default function TextInput({
  label,
  requiredText,
  errorText,
  helperText,
  ...rest
}: TextInputProps) {
  return (
    <Field.Root
      invalid={Boolean(errorText)}
      required={Boolean(requiredText)}
      className={clsx(
        "flex flex-col",
        "gap-0.5"
      )}
    >
      {label && (
        <Field.Label className="select-none">
          {label}
          <Field.RequiredIndicator className="text-red-500">{requiredText}</Field.RequiredIndicator>
        </Field.Label>
      )}
      <Field.Input
        className={clsx(
          "px-2 py-3",
          "rounded border"
        )}
        {...rest}
      />
      {helperText && (
        //MEMO: テキスト小さく
        <Field.HelperText className="text-gray-400">{helperText}</Field.HelperText>
      )}
      {errorText && (
        <Field.ErrorText className="text-red-500">{errorText}</Field.ErrorText>
      )}
    </Field.Root>
  );
}
