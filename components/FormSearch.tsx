import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormInputProps = {
  name: string;
  label: string;
  type: string;
};

const FormSearch: FC<IFormInputProps> = ({ name, label, type }) => {
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
        <>
          <input
            {...field}
            className={`block w-full px-4 py-2 border border-gray-400 rounded-full dark:bg-darker dark:border-gray-700 ${
              errors[name]
                ? "focus:outline-none focus:ring-1 focus:ring-red-500"
                : ""
            }`}
            type={type}
            placeholder={
              errors[name] ? errors[name]?.message?.toString() : label
            }
            autoComplete="off"
          />
          {/* {errors[name] && (
            <div className="mb-3 text-sm block text-red-500">
              {errors[name]?.message?.toString()}
            </div>
          )} */}
        </>
      )}
    />
  );
};

export default FormSearch;
