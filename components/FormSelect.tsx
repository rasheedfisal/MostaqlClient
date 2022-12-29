import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

type IFormSelectProps = {
  name: string;
  label: string;
  isLoading: boolean;
  data: ISelectData[];
  isRtl: boolean;
  isMulti: boolean;
};

export interface ISelectData {
  value: string;
  label: string;
}

const FormSelect: FC<IFormSelectProps> = ({
  name,
  label,
  isLoading = false,
  data,
  isRtl = false,
  isMulti = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <div className="flex flex-col w-full">
          <label>{label}</label>
          <Select
            // classNames={{
            //   control: () =>
            //     "px-1 py-1 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker",
            // }}
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            value={value}
            options={data}
            onChange={onChange}
            isMulti={isMulti}
            isRtl={isRtl}
            isClearable={true}
            isLoading={isLoading}
            // styles={{
            //   control: (baseStyles, state) => ({
            //     ...baseStyles,
            //     borderColor: "none",
            //   }),
            // }}
            // theme={(theme) => ({
            //   ...theme,
            //   borderRadius: 0,
            //   colors: {
            //     ...theme.colors,
            //     primary25: "hotpink",
            //     primary: "black",
            //   },
            // })}
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

export default FormSelect;
