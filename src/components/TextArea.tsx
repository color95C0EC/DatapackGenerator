import { Field } from "@ark-ui/react/field";
import clsx from "clsx/lite";
import { type ReactNode } from "react";


interface Props extends Field.RootProps {
  label?: ReactNode
  helperText?: ReactNode
  errorText?: ReactNode
  placeholder?: string
  requiredText?: string
  name?: string
  //MEMO: 名前OK？
  // onChange?(e: React.ChangeEvent<HTMLTextAreaElement>): void
}

export default function TextArea(props: Props) {
  return (
    <Field.Root
      {...props}
      invalid={Boolean(props.errorText)}
      required={Boolean(props.requiredText)}
      className={clsx(
        "flex flex-col",
        "gap-0.5"
      )}
    >
      {props.label ? (
        <Field.Label>
          {props.label}
          <Field.RequiredIndicator className="text-red-500">{props.requiredText}</Field.RequiredIndicator>
        </Field.Label>
      ) : null}
      <Field.Textarea
        className={clsx(
          "px-2 py-3",
          "rounded border"
        )}
        placeholder={props.placeholder}
        name={props.name}
        // TEST
          // ref={}
          // onChange={(e) => {console.log(e.target.value)}}
          // onChange={(e) => {if (props.onChange) props.onChange(e)}}
      />
      {/* {props.helperText ? (
        <Field.HelperText
          className=""
        >
          {props.helperText}
        </Field.HelperText>
      ) : null} */}
      {props.errorText ? (
        <Field.ErrorText
          className={clsx(
            "text-red-500"
          )}
        >
          {props.errorText}
        </Field.ErrorText>
      ) : null}
    </Field.Root>
  );
}
