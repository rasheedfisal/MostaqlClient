import React from "react";

type StatusProps = {
  accept: boolean | null;
};

const CancelRequestBadge = ({ accept }: StatusProps) => {
  if (accept === null) {
    return (
      <span className="bg-green-200 text-blue-600 py-1 px-3 rounded-full text-xs">
        Pending
      </span>
    );
  } else if (accept) {
    return (
      <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
        Cancelled
      </span>
    );
  } else {
    return (
      <span className="bg-gray-200 text-gray-600 py-1 px-3 rounded-full text-xs">
        Error
      </span>
    );
  }
};

export default CancelRequestBadge;
