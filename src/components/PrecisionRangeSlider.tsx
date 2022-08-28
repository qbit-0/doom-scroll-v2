import {
  Flex,
  FlexProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderProps,
  RangeSliderThumb,
  RangeSliderTrack,
  ThemingProps,
  UseCounterProps,
} from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  size?: ThemingProps["size"];
  value: [number, number];
  min: number;
  max: number;
  step: number;
  onMinChange: UseCounterProps["onChange"];
  onMaxChange: UseCounterProps["onChange"];
  onBothChange: RangeSliderProps["onChange"];
  onChangeEnd: RangeSliderProps["onChangeEnd"];
} & Omit<FlexProps, "onChange">;

const PrecisionRangeSlider: FC<Props> = ({
  size,
  value,
  min,
  max,
  step,
  onMinChange,
  onMaxChange,
  onBothChange,
  onChangeEnd,
  ...innerProps
}) => {
  return (
    <>
      <Flex columnGap="4" {...innerProps}>
        <NumberInput
          size={size}
          value={value[0]}
          min={min}
          max={value[1]}
          step={step}
          onChange={onMinChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <RangeSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onBothChange}
          onChangeEnd={onChangeEnd}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <NumberInput
          size={size}
          value={value[1]}
          min={value[0]}
          max={max}
          step={step}
          onChange={onMaxChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
    </>
  );
};

export default PrecisionRangeSlider;
