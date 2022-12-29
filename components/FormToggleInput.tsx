import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ToggleButton from "./ToggleButton";

type IFormInputProps = {
  name: string;
  defaultValue: boolean;
};

const FormToggleInput: FC<IFormInputProps> = ({ name, defaultValue }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <ToggleButton {...field} isEnabled={defaultValue} />
      )}
    />
  );
};

export default FormToggleInput;
