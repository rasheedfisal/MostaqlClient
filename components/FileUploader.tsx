import React, { useCallback, useState } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";

type FileUpLoaderProps = {
  multiple?: boolean;
  name: string;
  label: string;
  defaultUrl?: string;
};

const FileUpLoader: React.FC<FileUpLoaderProps> = ({
  name,
  multiple = false,
  label,
  defaultUrl = "",
}) => {
  const [sourceFile, setSourceFile] = useState(defaultUrl);

  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { field } = useController({ name, control });

  const onFileDrop = useCallback(
    (e: React.SyntheticEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const newFile = Object.values(target.files).map((file: File) => file);
      field.onChange(newFile[0]);

      var url = URL.createObjectURL(newFile[0]);
      setSourceFile(url);
    },

    [field]
  );
  return (
    <Controller
      name={name}
      defaultValue=""
      control={control}
      render={({ field: { name, onBlur, ref } }) => (
        <>
          <div className="mb-4">
            <img
              className="w-20 h-20 rounded-full object-cover object-center"
              src={sourceFile !== "" ? sourceFile : "/select-img.png"}
              alt="img"
            />
          </div>
          <label className="cursor-pointer mt-6">
            <span className="mt-2 leading-normal px-4 py-2 text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark rounded-full">
              {label}
            </span>
            <input
              type="file"
              className="hidden"
              name={name}
              onBlur={onBlur}
              ref={ref}
              onChange={onFileDrop}
              multiple={multiple}
              accept="image/jpg, image/png, image/jpeg"
            />
          </label>

          {errors[name] && (
            <div className="mb-3 text-normal text-red-500">
              {errors[name]?.message?.toString()}
            </div>
          )}
        </>
      )}
    />
  );
};

export default FileUpLoader;
