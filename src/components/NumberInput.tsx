import { NumberInput as ArkNumberInput } from "@ark-ui/react/number-input";
import { ChevronDown, ChevronUp } from "lucide-react";


export type NumberInputProps = {
  showStepTrigger?: boolean
} & ArkNumberInput.RootProps;

export default function NumberInput({
  showStepTrigger = true,
  ...rest
}: NumberInputProps) {
  return (
    <ArkNumberInput.Root {...rest}>
      <ArkNumberInput.Label>Label</ArkNumberInput.Label>
      <ArkNumberInput.Control>
        <ArkNumberInput.Input />
        {showStepTrigger && (
          <div>
            <ArkNumberInput.IncrementTrigger>
              <ChevronUp />
            </ArkNumberInput.IncrementTrigger>
            <ArkNumberInput.DecrementTrigger>
              <ChevronDown />
            </ArkNumberInput.DecrementTrigger>
          </div>
        )}
      </ArkNumberInput.Control>
    </ArkNumberInput.Root>
  );
}
