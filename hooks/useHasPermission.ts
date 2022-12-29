import { useStateContext } from "../context/AppConext";
export const useHasPermissions = (permissionNames: string[]) => {
  const stateContext = useStateContext();
  const permissions = stateContext.state.authUser?.permissions;

  if (!permissions) {
    return false;
  }
  if (typeof permissionNames === "number") {
    return permissions.includes?.(permissionNames);
  } else if (Array.isArray(permissionNames)) {
    return permissions.some((permissionName) =>
      Boolean(permissionNames.includes?.(permissionName))
    );
  } else {
    return false;
  }
};

//const canComment = useHasPermissions(['CAN_READ', 'CAN_ADD_COMMENT']);  // checks for multiple permissions
//const canRead = useHasPermissions('CAN_READ'); // checks for single permission
