"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FileUpLoader from "../../../../components/FileUploader";
import useAccessToken from "../../../../hooks/useAccessToken";
import SubmitButton from "../../../../components/SubmitButton";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import FormInput from "../../../../components/FormInput";
import Link from "next/link";
import { getUserFn, updateUserFn } from "../../../api/usersApi";
import { getAllRolesFn } from "../../../api/rolesApi";
import FormSelect from "../../../../components/FormSelect";

type PageProps = {
  params: {
    userId: string;
  };
};

const updateUserSchema = object({
  fullname: string().min(1, "Name is required"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  phone: string().min(1, "Phone is required"),
  role: z.object({
    label: z.string(),
    value: z.string(),
  }),
  profileImage: z.custom<File>((v) => v instanceof File).optional(),
  password: string().optional(),
}).partial();

type IUpdateUser = TypeOf<typeof updateUserSchema>;

const page = ({ params: { userId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const {
    isLoading: isRolesLoading,
    isSuccess,
    data: roles,
    error
  } = useQuery( {
    queryKey: ["roles"],
    queryFn: () => getAllRolesFn(token),
    select: (data) => data,
    retry: 1
  });

  const { isLoading: isUserLoading, data: getUser , isSuccess: isUserSuccessfull} = useQuery(
    {
      queryKey: ["getUser", userId],
      queryFn: () => getUserFn(userId, token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updateUser } = useMutation(
    {
      mutationFn: ({
        id,
        formData,
        accessToken,
      }: {
        id: string;
        formData: FormData;
        accessToken: string;
      }) => updateUserFn({ id, formData, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["users"]});
        toast.success("User updated successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdateUser>({
    resolver: zodResolver(updateUserSchema),
  });

  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  if (isUserSuccessfull) {
     methods.reset({
            fullname: getUser.fullname,
            email: getUser.email,
            phone: getUser.phone,
            role: {
              label: getUser.Role?.role_name,
              value: getUser.Role?.id,
            },
          });
  }

   if (error !== null) {
    toast.error(error.message, {position: "top-right"});
  }

  const onSubmitHandler: SubmitHandler<IUpdateUser> = (values) => {
    const formData = new FormData();
    if (values.role?.value !== undefined) {
      formData.append("role_id", values.role?.value);
    }
    if (values.email !== undefined) {
      formData.append("email", values.email);
    }
    if (values.fullname !== undefined) {
      formData.append("fullname", values.fullname);
    }
    if (values.phone !== undefined) {
      formData.append("phone", values.phone);
    }
    if (values.profileImage !== undefined) {
      formData.append("profileImage", values.profileImage);
    }
    if (values.password !== undefined && values.password !== "") {
      formData.append("password", values.password);
    }
    updateUser({ id: userId, formData, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Update User</h1>
        <Link
          href="/users"
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
              <div className="grid grid-cols-1">
                <FormInput label="Name" type="text" name="fullname" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FormInput label="Email" type="email" name="email" />
                <FormInput label="Phone" type="text" name="phone" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FormSelect
                  label="Role"
                  name="role"
                  isLoading={isRolesLoading}
                  data={
                    isSuccess
                      ? roles.results.map(({ id, role_name }) => ({
                          value: id,
                          label: role_name,
                        }))
                      : []
                  }
                  isMulti={false}
                  isRtl={false}
                />
                <FormInput label="Password" type="password" name="password" />
              </div>
              <div className="flex flex-col items-center">
                <FileUpLoader
                  name="profileImage"
                  multiple={false}
                  label="select avatar"
                  defaultUrl={getUser?.imgPath}
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
