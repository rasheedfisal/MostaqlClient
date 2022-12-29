import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormInputProps = {
  name: string;
  label: string;
  type: string;
};

const FormInput2: FC<IFormInputProps> = ({ name, label, type }) => {
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
        <input
          {...field}
          className={`w-full px-4 py-2 border border-gray-400  rounded-md dark:bg-darker ${
            errors[name]
              ? " dark:border-red-700 focus:outline-none focus:ring focus:ring-red-600 dark:focus:ring-primary-darker"
              : "dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
          }`}
          type={type}
          placeholder={errors[name] ? errors[name]?.message?.toString() : label}
        />
      )}
    />
  );
};

export default FormInput2;
