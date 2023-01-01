import React from "react";
import { StatusNames } from "../typings";

type StatusProps = {
  statusName: StatusNames;
};

const StatusBadge = ({ statusName }: StatusProps) => {
  if (statusName === "Open") {
    return (
      <span className="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">
        {statusName}
      </span>
    );
  } else if (statusName === "In-Progress") {
    return (
      <span className="bg-orange-200 text-orange-600 py-1 px-3 rounded-full text-xs">
        {statusName}
      </span>
    );
  } else if (statusName === "Completed") {
    return (
      <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
        {statusName}
      </span>
    );
  } else if (statusName === "Closed") {
    return (
      <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
        {statusName}
      </span>
    );
  } else if (statusName === "Re-Open") {
    return (
      <span className="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">
        {statusName}
      </span>
    );
  } else {
    return (
      <span className="bg-gray-200 text-gray-600 py-1 px-3 rounded-full text-xs">
        {statusName}
      </span>
    );
  }
};

export default StatusBadge;
