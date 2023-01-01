"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserFn } from "../../../api/usersApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput from "../../../../components/FormInput";
import SubmitButton from "../../../../components/SubmitButton";
import useAccessToken from "../../../../hooks/useAccessToken";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { createRoleFn } from "../../../api/rolesApi";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";

const createRoleSchema = object({
  role_name: string().min(1, "Role is required"),
  role_description: string().min(1, "Description is required"),
});

export type ICreateUpdateRole = TypeOf<typeof createRoleSchema>;
const Add = () => {
  const token = useAccessToken();

  const queryClient = useQueryClient();
  const { isLoading, mutate: createRole } = useMutation(
    (role: ICreateUpdateRole) => createRoleFn(role, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["roles"]);
        toast.success("Role created successfully");
      },
      onError: (error: any) => {
        if ((error as any).response?.data?.msg?.message) {
          toast.error((error as any).response?.data?.msg?.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  const methods = useForm<ICreateUpdateRole>({
    resolver: zodResolver(createRoleSchema),
  });
  const {
    formState: { isSubmitSuccessful },
  } = methods;

  useUpdateEffect(() => {
    if (isSubmitSuccessful) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<ICreateUpdateRole> = (values) => {
    createRole(values);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Add Role</h1>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FormInput label="Name" type="text" name="role_name" />
                <FormInput
                  label="Description"
                  type="text"
                  name="role_description"
                />
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

export default Add;
