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
import { getAllRolesFn } from "../../../api/rolesApi";
import FileUpLoader from "../../../../components/FileUploader";
import FormSelect, { ISelectData } from "../../../../components/FormSelect";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";

const createUserSchema = object({
  fullname: string().min(1, "Name is required"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  phone: string().min(1, "Phone is required"),
  password: string()
    .min(1, "Password is required")
    .max(32, "Password must be less than 32 characters"),
  role: z.object({
    label: z.string(),
    value: z.string(),
  }),
  profileImage: z.custom<File>((v) => v instanceof File).optional(),
});

export type ICreateUser = TypeOf<typeof createUserSchema>;
const Add = () => {
  const token = useAccessToken();

  const {
    isLoading: isRolesLoading,
    isSuccess,
    data: roles,
  } = useQuery(["roles"], () => getAllRolesFn(token), {
    select: (data) => data,
    retry: 1,
    onError: (error) => {
      if ((error as any).response?.data?.msg) {
        toast.error((error as any).response?.data?.msg, {
          position: "top-right",
        });
      }
    },
  });

  const queryClient = useQueryClient();
  const { isLoading, mutate: createUser } = useMutation(
    (user: FormData) => createUserFn(user, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        toast.success("User created successfully");
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

  const methods = useForm<ICreateUser>({
    resolver: zodResolver(createUserSchema),
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

  const onSubmitHandler: SubmitHandler<ICreateUser> = (values) => {
    const formData = new FormData();

    formData.append("role_id", values.role.value);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("fullname", values.fullname);
    formData.append("phone", values.phone);
    if (values.profileImage !== undefined) {
      formData.append("profileImage", values.profileImage);
    }
    createUser(formData);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Add User</h1>
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
                <FormInput label="Password" type="password" name="password" />

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
              </div>
              <div className="flex flex-col items-center">
                <FileUpLoader
                  name="profileImage"
                  multiple={false}
                  label="select avatar"
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
