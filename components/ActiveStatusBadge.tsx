import React from "react";

type StatusProps = {
  isActive: boolean;
};

const ActiveStatusBadge = ({ isActive }: StatusProps) => {
  if (isActive) {
    return (
      <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
        Active
      </span>
    );
  } else {
    return (
      <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
        Not Active
      </span>
    );
  }
};

export default ActiveStatusBadge;
