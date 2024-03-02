"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAccessToken from "../../../../hooks/useAccessToken";
import SubmitButton from "../../../../components/SubmitButton";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import FormInput from "../../../../components/FormInput";
import Link from "next/link";
import { getRoleFn, updateRoleFn } from "../../../api/rolesApi";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";

type PageProps = {
  params: {
    roleId: string;
  };
};

const updateRoleSchema = object({
  role_name: string().min(1, "Role is required"),
  role_description: string().min(1, "Description is required"),
}).partial();

export type IUpdateRole = TypeOf<typeof updateRoleSchema>;

const page = ({ params: { roleId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isPriceLoading, data, isSuccess, error } = useQuery(
    {
      queryKey: ["getRole", roleId],
      queryFn: () => getRoleFn(roleId, token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updateRole } = useMutation(
    {
      mutationFn: ({
        id,
        data,
        accessToken,
      }: {
        id: string;
        data: IUpdateRole;
        accessToken: string;
      }) => updateRoleFn({ id, data, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["roles"]});
        toast.success("Role updated successfully");
      },
      onError: (error) => {
        toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdateRole>({
    resolver: zodResolver(updateRoleSchema),
  });

    useUpdateEffect(() => {
    if (isSuccess) {
      methods.reset({
            role_name: data.role_name,
            role_description: data.role_description,
          });
    }
  }, [isSuccess])

   useUpdateEffect(() => {
    if (error !== null) {
      toast.error(error.message, {position: "top-right"});
    }
  }, [error])

  if (isPriceLoading) {
    return <p>Loading...</p>;
  }

  

  const onSubmitHandler: SubmitHandler<IUpdateRole> = (values) => {
    updateRole({ id: roleId, data: values, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Update Role</h1>
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
                  clicked={isPending}
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
