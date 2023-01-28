import React from "react";

type StatusProps = {
  accept: boolean | null;
};

const RequestStatusBadge = ({ accept }: StatusProps) => {
  if (accept === null) {
    return (
      <span className="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">
        Pending
      </span>
    );
  } else if (accept) {
    return (
      <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
        Approved
      </span>
    );
  } else {
    return (
      <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
        Rejected
      </span>
    );
  }
};

export default RequestStatusBadge;
