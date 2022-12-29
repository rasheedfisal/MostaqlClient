import { useStateContext } from "../context/AppConext";
export const useHasRole = (roleNames: string[]) => {
  const stateContext = useStateContext();

  const user = stateContext.state.authUser;

  const userTypeId = user?.id || { userTypeId: null };

  if (!userTypeId) {
    return false;
  }
  if (typeof roleNames === "number") {
    return userTypeId === roleNames;
  } else if (Array.isArray(roleNames)) {
    return roleNames.some((role) => role === userTypeId);
  } else {
    return false;
  }
};

//const hasAdminRole = useHasRoles(['ADMIN']); // checks for multiple roles
//const hasSuperAdminRole = useHasRoles('SUPER_ADMIN'); // checks for single role
