import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormRadioButtonProps = {
  name: string;
  label: string;
  value: string;
};

const FormRadioButton: FC<IFormRadioButtonProps> = ({ name, label, value }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col w-full">
          <div className="flex justify-start">
            <div className="form-check">
              {/* <input
                className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio"
                onChange={onChange}
                checked={value}
              /> */}
              <input {...field} type="radio" value={value} />
              <label className="form-check-label inline-block text-gray-800 dark:text-gray-100">
                {label}
              </label>
            </div>
          </div>
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

export default FormRadioButton;
