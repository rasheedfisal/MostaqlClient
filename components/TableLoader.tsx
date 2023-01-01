import React from "react";

const TableLoader = () => {
  return (
    <span className="absolute w-full h-full inset-0 z-10 opacity-50 bg-primary-darker">
      <p className="flex justify-center items-start font-bold text-2xl mt-10 text-white">
        Loading...
      </p>
    </span>
  );
};

export default TableLoader;
