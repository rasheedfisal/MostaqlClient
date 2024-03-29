"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAccessToken from "../../../hooks/useAccessToken";
import SubmitButton from "../../../components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import FormInput from "../../../components/FormInput";
import { getContactFn, updateContactFn } from "../../api/siteInfoApi";
import useUpdateEffect from "../../../hooks/useUpdateEffect";

const updsertContactSchema = object({
  website_link: string().min(1, "Link is required"),
  phone: string().min(1, "Phone is required"),
  email: string().min(1, "Email is required").email(),
}).partial();

export type IUpdsertContact = TypeOf<typeof updsertContactSchema>;

const page = () => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isItemsLoading, isSuccess, data, error } = useQuery({
      queryKey: ["getContact"],
      queryFn: () => getContactFn(token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updateItem } = useMutation(
    {
      mutationFn:  ({ data, accessToken }: { data: IUpdsertContact; accessToken: string }) =>
      updateContactFn({ data, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["getContact"]});
        toast.success("Contact updated successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdsertContact>({
    resolver: zodResolver(updsertContactSchema),
  });

  useUpdateEffect(() => {
    if (isSuccess) {
       methods.reset({
      website_link: data.website_link,
      phone: data.phone,
      email: data.email,
    });
    }
  }, [isSuccess])

   useUpdateEffect(() => {
    if (error !== null) {
      toast.error(error.message, {position: "top-right"});
    }
  }, [error])

  if (isItemsLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpdsertContact> = (values) => {
    updateItem({ data: values, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Contact</h1>
        {/* <Link
          href="/roles"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link> */}
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
                <FormInput
                  label="Website Link"
                  type="text"
                  name="website_link"
                />
                <FormInput label="Phone" type="text" name="phone" />
                <FormInput label="Email" type="email" name="email" />
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
