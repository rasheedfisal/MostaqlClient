import { getRolePermissionFn, getAllPermissionFn } from "../app/api/rolesApi";
import { IPermission } from "../typings";

interface IRolePermissions {
  permissionId: string;
  permissionName: string;
  permissionDescription: string;
  isEnabled: boolean;
}
const useRolePermissions = async (
  roleId: string,
  token: string
): Promise<IRolePermissions[]> => {
  try {
    // const allPermissionPromise = getAllPermissionFn(token);
    // const rolePermissionPromise = getRolePermissionFn(roleId, token);

    // const allPermission = await allPermissionPromise;
    // const rolePermission = await rolePermissionPromise;

    const allPermission = await getAllPermissionFn(token);
    const rolePermission = await getRolePermissionFn(roleId, token);

    // if (!Array.isArray(allPermission) || !Array.isArray(rolePermission)) {
    //   console.log("not an array");
    //   return [];
    // }

    // .concat() to not mutate arguments

    const arrPermissions: IPermission[] = allPermission
      .concat()
      .sort((a, b) => (a.perm_name < b.perm_name ? -1 : 1));
    const arrRolePermission: IPermission[] = rolePermission.permissions
      .concat()
      .sort((a, b) => (a.perm_name < b.perm_name ? -1 : 1));

    const newArray: IRolePermissions[] = [];
    for (let i = 0; i < arrPermissions.length; i++) {
      if (arrRolePermission[i]) {
        if (arrPermissions[i].perm_name === arrRolePermission[i].perm_name) {
          newArray.push({
            permissionId: arrPermissions[i].id,
            permissionName: arrPermissions[i].perm_name,
            permissionDescription: arrPermissions[i].perm_description,
            isEnabled: true,
          });
        } else {
          newArray.push({
            permissionId: arrPermissions[i].id,
            permissionName: arrPermissions[i].perm_name,
            permissionDescription: arrPermissions[i].perm_description,
            isEnabled: false,
          });
        }
      } else {
        newArray.push({
          permissionId: arrPermissions[i].id,
          permissionName: arrPermissions[i].perm_name,
          permissionDescription: arrPermissions[i].perm_description,
          isEnabled: false,
        });
      }
    }
    return newArray;
  } catch (error) {
    // console.log(error);
    return [];
  }
};

export default useRolePermissions;
