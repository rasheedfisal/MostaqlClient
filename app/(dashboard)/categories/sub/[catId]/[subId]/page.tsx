"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAccessToken from "../../../../../../hooks/useAccessToken";
import SubmitButton from "../../../../../../components/SubmitButton";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import FormInput from "../../../../../../components/FormInput";
import Link from "next/link";
import {
  getSubCategoryFn,
  updateSubCategoryFn,
} from "../../../../../api/categoryApi";
import useUpdateEffect from "../../../../../../hooks/useUpdateEffect";

type PageProps = {
  params: {
    subId: string;
    catId: string;
  };
};

const updateSubCatSchema = object({
  name: string().min(1, "Name is required"),
}).partial();

export type IUpdateSubCat = TypeOf<typeof updateSubCatSchema>;

const page = ({ params: { catId, subId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isPriceLoading, data, isSuccess, error } = useQuery(
    {
      queryKey: ["getSubCat", subId],
      queryFn: () => getSubCategoryFn(subId, token),
      select: (data) => data,
      retry: 1,
    }
  );

  const { isPending, mutate: updateSubCat } = useMutation(
    {
      mutationFn:  ({
      id,
      data,
      accessToken,
    }: {
      id: string;
      data: IUpdateSubCat;
      accessToken: string;
    }) => updateSubCategoryFn({ id, data, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["subcategories", catId]});
        toast.success("Sub Categories updated successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdateSubCat>({
    resolver: zodResolver(updateSubCatSchema),
  });

  useUpdateEffect(() => {
    if (isSuccess) {
      methods.reset({
      name: data.name,
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

  const onSubmitHandler: SubmitHandler<IUpdateSubCat> = (values) => {
    updateSubCat({ id: subId, data: values, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Update Sub Category</h1>
        <Link
          href={`/categories/sub/${catId}`}
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
                <FormInput label="Name" type="text" name="name" />
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
