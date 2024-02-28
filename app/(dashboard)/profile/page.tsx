"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAccessToken from "../../../hooks/useAccessToken";
import { toast } from "react-toastify";
import { updateAdminProfileFn } from "../../api/usersApi";
import { useStateContext } from "../../../context/AppConext";
import { object, string, TypeOf, z } from "zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../../components/FormInput";
import FileUpLoader from "../../../components/FileUploader";
import SubmitButton from "../../../components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import { useState } from "react";
import { getMeFn } from "../../api/authApi";

const updateUserSchema = object({
  fullname: string().min(1, "Name is required"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  phone: string().min(1, "Phone is required"),
  profileImage: z.custom<File>((v) => v instanceof File).optional(),
  password: string().optional(),
}).partial();

type IUpdateUser = TypeOf<typeof updateUserSchema>;
const page = () => {
  const token = useAccessToken();
  const [img, setImg] = useState("");
  const [enableQuery, setEnableQuery] = useState(false);
  const stateContext = useStateContext();

  useUpdateEffect(() => {
    methods.reset({
      fullname: stateContext.state?.authUser?.fullname,
      email: stateContext.state?.authUser?.email,
      phone: stateContext.state?.authUser?.phone,
    });
    setImg(stateContext.state.authUser?.imgPath ?? "/noImg.jpg");
  }, []);
  useUpdateEffect(() => {
    methods.reset({
      fullname: stateContext.state?.authUser?.fullname,
      email: stateContext.state?.authUser?.email,
      phone: stateContext.state?.authUser?.phone,
    });
    setImg(stateContext.state.authUser?.imgPath ?? "/noImg.jpg");
  }, [stateContext.state]);

  useUpdateEffect(() => {
    setImg(stateContext.state.authUser?.imgPath ?? "/noImg.jpg");
  }, [stateContext.state]);

  const { isFetching: isUserDataLoading } = useQuery(
    ["authUser", 1200],
    () => getMeFn(token),
    {
      enabled: enableQuery,
      select: (data) => data,
      retry: 1,
      // staleTime: Infinity,
      onSuccess: (data) => {
        stateContext.dispatch({ type: "SET_USER", payload: data });
        toast.success("Profile updated successfully");
      },
    }
  );

  const { isLoading, mutate: updateUser } = useMutation(
    ({ formData, accessToken }: { formData: FormData; accessToken: string }) =>
      updateAdminProfileFn({ formData, accessToken }),
    {
      onSuccess: () => {
        setEnableQuery(true);
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

  const methods = useForm<IUpdateUser>({
    resolver: zodResolver(updateUserSchema),
  });

  const onSubmitHandler: SubmitHandler<IUpdateUser> = (values) => {
    const formData = new FormData();

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
    updateUser({ formData, accessToken: token });
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>
      <div className="mt-5">
        <div className="min-w-full rounded gap-5 lg:grid lg:grid-cols-3">
          <div className="lg:block lg:col-span-1 px-4 py-6  rounded-md bg-white dark:bg-darker">
            {/* <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker"> */}
            <div className="flex justify-between">
              <span className="text-xl font-semibold block">Admin Profile</span>
              {/* <a
                href="#"
                className="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800"
              >
                Edit
              </a> */}
            </div>

            <span className="text-gray-600">
              This information is secret so be careful
            </span>
            <div className="w-full p-8 mx-2 flex justify-center">
              <img
                id="showImage"
                className="max-w-xs w-32 items-center border"
                src={img}
                alt=""
              />
            </div>
          </div>
          {/* <div className="w-full relative px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker"> */}

          <div className="lg:col-span-2 px-4 py-6 rounded-md bg-white dark:bg-darker">
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
                </div>
                <div className="flex flex-col items-center">
                  <FileUpLoader
                    name="profileImage"
                    multiple={false}
                    label="select avatar"
                    defaultUrl={stateContext.state.authUser?.imgPath}
                  />
                </div>
                <div className="flex">
                  <SubmitButton
                    title="Update"
                    clicked={isLoading || isUserDataLoading}
                    loadingTitle="loading..."
                    icon={<DocumentPlusIcon className="h-5 w-5" />}
                  />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
