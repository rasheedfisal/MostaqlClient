"use client";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";
// import useRolePermissions from "../../../../../hooks/useRolePermissions";
import useAccessToken from "../../../../../hooks/useAccessToken";
import { useForm } from "react-hook-form";
import SubmitButton from "../../../../../components/SubmitButton";
import {
  addPermissionsToRoleFn,
  AddRolePermissions,
  getAllPermissionFn,
  getRolePermissionFn,
} from "../../../../api/rolesApi";
import { useQueries } from "@tanstack/react-query";
// import { IPermission } from "../../../../../typings";
import { useRouter } from "next/navigation";
type PageProps = {
  params: {
    roleId: string;
  };
};

interface rolePerm {
  // 👇️ key         value
  [key: string]: boolean;
}

const page = ({ params: { roleId } }: PageProps) => {
  const token = useAccessToken();
  const router = useRouter();
  const [allPermission, rolePermission] = useQueries({
    queries: [
      {
        queryKey: ["allPermissions"],
        queryFn: () => getAllPermissionFn(token),
      },

      {
        queryKey: ["userRolePermissions"],
        queryFn: () => getRolePermissionFn(roleId, token),
        staleTime: 0,
        cacheTime: 0,
      },
    ],
  });

  const { isLoading: isPermessionLoading, mutate: createRolePermission } =
    useMutation(
      (rolePermissions: AddRolePermissions) =>
        addPermissionsToRoleFn(rolePermissions, roleId, token),
      {
        onSuccess: (data) => {
          toast.success("Role Permissions Updated successfully");
          router.push("/roles");
        },
        onError: (error: any) => {
          if ((error as any).response?.data?.msg) {
            toast.error((error as any).response?.data?.msg, {
              position: "top-right",
            });
          }
        },
      }
    );
  const { register, handleSubmit } = useForm({
    mode: "onBlur",
  });
  const handleSubmitClick = (data: rolePerm) => {
    let permission: string[] = [];
    for (let index = 0; index < Object.keys(data).length; index++) {
      if (Object.values(data)[index] !== undefined) {
        if (Object.values(data)[index]) {
          permission.push(Object.keys(data)[index]);
        }
      }
    }
    const rolePermissions: AddRolePermissions = {
      permissions: permission,
    };
    createRolePermission(rolePermissions);
  };

  if (allPermission.isLoading || rolePermission.isLoading)
    return <p>Loading Permissions...</p>;

  if (allPermission.error) {
    toast.error((allPermission.error as any).response?.data?.msg, {
      position: "top-right",
    });
  }

  if (rolePermission.error) {
    toast.error((rolePermission.error as any).response?.data?.msg, {
      position: "top-right",
    });
  }

  if (!allPermission.isSuccess || !rolePermission.isSuccess) {
    toast.error("Server Error", {
      position: "top-right",
    });
  }

  const newPermissions = allPermission.data?.map((obj) => ({
    ...obj,
    isEnabled: rolePermission.data?.permissions.some(
      (el) => el.perm_name === obj.perm_name
    ),
  }));

  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Role Permissions</h1>
        <Link
          href="/roles"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <form
            className="space-y-6"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(handleSubmitClick)}
          >
            <div className="flex justify-start items-center flex-wrap">
              {newPermissions?.map((perm) => (
                <div
                  key={perm.id}
                  className="flex items-center m-2 border rounded-full border-gray-200 p-2"
                >
                  <label className="flex items-center">
                    <div className="relative inline-flex items-center">
                      <input
                        {...register(`${perm.id}`)}
                        type="checkbox"
                        name={perm.id}
                        className="w-10 h-4 transition bg-gray-200 border-none rounded-full shadow-inner outline-none appearance-none toggle checked:bg-primary-light disabled:bg-gray-200 focus:outline-none"
                        defaultChecked={perm.isEnabled}
                        onChange={(e) => (perm.isEnabled = e.target.checked)}
                      />
                      <span className="absolute top-0 left-0 w-4 h-4 transition-all transform scale-150 bg-white rounded-full shadow-sm"></span>
                    </div>
                    <label className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                      {perm.perm_description}
                    </label>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex">
              <SubmitButton
                title="Submit"
                clicked={isPermessionLoading}
                loadingTitle="loading..."
                icon={<DocumentPlusIcon className="h-5 w-5" />}
              />
            </div>
          </form>
          {/* </FormProvider> */}
        </div>
      </div>
    </>
  );
};

export default page;
