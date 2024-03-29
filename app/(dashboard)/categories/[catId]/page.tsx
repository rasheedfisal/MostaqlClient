"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoryFn, updateCategoryFn } from "../../../api/categoryApi";
import FileUpLoader from "../../../../components/FileUploader";
import useAccessToken from "../../../../hooks/useAccessToken";
import SubmitButton from "../../../../components/SubmitButton";
import {
  ChevronDoubleLeftIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import FormInput from "../../../../components/FormInput";
import Link from "next/link";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";

type PageProps = {
  params: {
    catId: string;
  };
};

const updateCategorySchema = object({
  cat_name: string().min(1, "Name is required"),
  cat_description: string().min(1, "Description is required"),
  CategoryImg: z.custom<File>((v) => v instanceof File).optional(),
}).partial();

type IUpdateCategory = TypeOf<typeof updateCategorySchema>;

const page = ({ params: { catId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();


  const { isLoading: isCatLoading, data: category, isSuccess, error } = useQuery(
    {
      queryKey: ["getCategory", catId],
      queryFn: () => getCategoryFn(catId, token),
      select: (data) => data,
      retry: 1,
    }
  );


  const { isPending, mutate: updateCategory } = useMutation(
    {
      mutationFn: ({
      id,
      formData,
      accessToken,
    }: {
      id: string;
      formData: FormData;
      accessToken: string;
    }) => updateCategoryFn({ id, formData, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["categories"]});
        toast.success("Category updated successfully");
      },
      onError: (error) => {
        toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const methods = useForm<IUpdateCategory>({
    resolver: zodResolver(updateCategorySchema),
  });


  
  useUpdateEffect(() => {
    if (isSuccess) {
      methods.reset({
        cat_name: category.cat_name,
        cat_description: category.cat_description,
      });
    }
  }, [isSuccess])

   useUpdateEffect(() => {
    if (error !== null) {
      toast.error(error.message, {position: "top-right"});
    }
  }, [error])

  if (isCatLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpdateCategory> = (values) => {
    const formData = new FormData();
    if (values.cat_name !== undefined) {
      formData.append("cat_name", values.cat_name);
    }
    if (values.cat_description !== undefined) {
      formData.append("cat_description", values.cat_description);
    }
    if (values.CategoryImg !== undefined) {
      formData.append("CategoryImg", values.CategoryImg);
    }
    updateCategory({ id: catId, formData, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Update Category</h1>
        <Link
          href="/categories"
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
                <FormInput label="Name" type="text" name="cat_name" />
                <FormInput
                  label="Description"
                  type="text"
                  name="cat_description"
                />
              </div>
              <div className="flex flex-col items-center">
                <FileUpLoader
                  name="CategoryImg"
                  multiple={false}
                  label="select image"
                  defaultUrl={category?.cat_img}
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
