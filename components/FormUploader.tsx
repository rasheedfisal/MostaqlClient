import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";

type FileUpLoaderProps = {
  name: string;
  icon: JSX.Element;
  setFileUrl?: Dispatch<SetStateAction<string>>;
  allowdTypes: string;
};

const FormUploader: React.FC<FileUpLoaderProps> = ({
  name,
  icon,
  setFileUrl,
  allowdTypes,
}) => {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

  const onFileDrop = useCallback(
    (e: React.SyntheticEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const newFile = Object.values(target.files).map((file: File) => file);
      field.onChange(newFile[0]);

      var url = URL.createObjectURL(newFile[0]);
      if (setFileUrl !== undefined) setFileUrl(url);
    },

    [field]
  );
  return (
    <Controller
      name={name}
      defaultValue=""
      control={control}
      render={({ field: { name, onBlur, ref } }) => (
        <label className="cursor-pointer">
          <div>{icon}</div>
          <input
            type="file"
            className="hidden"
            name={name}
            onBlur={onBlur}
            ref={ref}
            onChange={onFileDrop}
            multiple={false}
            accept={allowdTypes}
          />
        </label>
      )}
    />
  );
};

export default FormUploader;
