import React, { ChangeEventHandler } from "react";

type ToggleProps = {
  name: string;
  title: string;
  isToggled: boolean;
  onToggle: ChangeEventHandler<HTMLInputElement>;
};
const FormSwitch = ({ name, title, isToggled, onToggle }: ToggleProps) => {
  return (
    <label className="flex items-center">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          name={name}
          className="w-10 h-4 transition bg-gray-200 border-none rounded-full shadow-inner outline-none appearance-none toggle checked:bg-primary-light disabled:bg-gray-200 focus:outline-none"
          defaultChecked={isToggled}
          onChange={onToggle}
        />
        <span className="absolute top-0 left-0 w-4 h-4 transition-all transform scale-150 bg-white rounded-full shadow-sm"></span>
      </div>
      <label className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
        {title}
      </label>
    </label>
  );
};

export default FormSwitch;
