import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormInputProps = {
  name: string;
  label: string;
  rows: number;
};

const FormTextArea: FC<IFormInputProps> = ({ name, label, rows }) => {
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
        <div className="flex flex-col w-full">
          <label>{label}</label>
          <textarea
            {...field}
            className="px-4 py-2 border border-gray-400 rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
            name="title"
            autoComplete="off"
            rows={rows}
          />
          {errors[name] && (
            <div className="mb-3 text-normal text-red-500">
              {errors[name]?.message?.toString()}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default FormTextArea;
