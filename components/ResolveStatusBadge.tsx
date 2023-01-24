import React from "react";

type StatusProps = {
  accept: boolean;
};

const ResolveStatusBadge = ({ accept }: StatusProps) => {
  if (accept === false) {
    return (
      <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
        UnResolved
      </span>
    );
  } else {
    return (
      <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
        Resolved
      </span>
    );
  }
};

export default ResolveStatusBadge;
