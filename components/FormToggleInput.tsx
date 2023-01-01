import { ChangeEventHandler, FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormSwitch from "./FormSwitch";

type IFormInputProps = {
  name: string;
  title: string;
  isToggled: boolean;
  onToggle: ChangeEventHandler<HTMLInputElement>;
};
const FormToggleInput: FC<IFormInputProps> = ({
  name,
  title,
  isToggled,
  onToggle,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormSwitch
          title={title}
          name={name}
          isToggled={isToggled}
          onToggle={onToggle}
        />
      )}
    />
  );
};

export default FormToggleInput;
