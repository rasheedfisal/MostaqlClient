import React from "react";

type StatusProps = {
  isAuthorize: boolean;
};

const AuthorizeStatusBadge = ({ isAuthorize }: StatusProps) => {
  if (isAuthorize) {
    return (
      <span className="bg-green-200 text-green-600  py-1 px-3 rounded-full text-xs">
        Authorized
      </span>
    );
  } else {
    return (
      <span className="bg-red-200 text-red-600 py-1  px-3 rounded-full text-xs">
        UnAuthorized
      </span>
    );
  }
};

export default AuthorizeStatusBadge;
