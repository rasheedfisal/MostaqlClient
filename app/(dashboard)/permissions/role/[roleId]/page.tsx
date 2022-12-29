"use client";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";
import PageLoader from "../../../../../components/PageLoader";
import ToggleButton from "../../../../../components/ToggleButton";
import useRolePermissions from "../../../../../hooks/useRolePermissions";
import useAccessToken from "../../../../../hooks/useAccessToken";
import { object, string, TypeOf, z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateEffect from "../../../../../hooks/useUpdateEffect";
import SubmitButton from "../../../../../components/SubmitButton";
type PageProps = {
  params: {
    roleId: string;
  };
};

const createRoleSchema = object({
  rolePermission: z.object({
    permid: z.string(),
    value: z.boolean(),
  }),
});

export type ICreateRolePermission = TypeOf<typeof createRoleSchema>;
const page = ({ params: { roleId } }: PageProps) => {
  const token = useAccessToken();
  const { isLoading, data: rolePerm } = useQuery(
    ["rolePermissions"],
    () => useRolePermissions(roleId, token),
    {
      select: (data) => data,
      retry: 1,
      onError: (error) => {
        toast.error("Server Error", {
          position: "top-right",
        });
        // if (Array.isArray((error as any).data.error)) {
        //   (error as any).data.error.forEach((el: any) =>
        //     toast.error(el.message, {
        //       position: "top-right",
        //     })
        //   );
        // } else {
        //   toast.error((error as any).data.message, {
        //     position: "top-right",
        //   });
        // }
      },
    }
  );

  const methods = useForm<ICreateRolePermission>({
    resolver: zodResolver(createRoleSchema),
  });

  const {
    formState: { errors, isSubmitSuccessful },
  } = methods;
  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<ICreateRolePermission> = (values) => {
    console.log(values);
  };

  if (isLoading) {
    return <PageLoader />;
  }

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
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
              <div className="flex justify-start items-center flex-wrap space-x-4 space-y-4">
                {rolePerm?.map((perm) => (
                  <div
                    key={perm.permissionId}
                    className="flex items-center space-x-2 border rounded-full border-gray-200 p-2"
                  >
                    {/* <span className="text-sm text-gray-500 dark:text-light">
                      
                    </span> */}
                    <label className="flex items-center">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          name={perm.permissionId}
                          className="w-10 h-4 transition bg-gray-200 border-none rounded-full shadow-inner outline-none appearance-none toggle checked:bg-primary-light disabled:bg-gray-200 focus:outline-none"
                          // checked={isEnabled}
                        />
                        <span className="absolute top-0 left-0 w-4 h-4 transition-all transform scale-150 bg-white rounded-full shadow-sm"></span>
                      </div>
                      <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                        {perm.permissionDescription}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex">
                <SubmitButton
                  title="Submit"
                  clicked={isLoading}
                  loadingTitle="loading..."
                  icon={<DocumentPlusIcon className="h-5 w-5" />}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default page;
