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
import { createCategoryFn } from "../../../api/categoryApi";

const createUpdateCategorySchema = object({
  cat_name: string().min(1, "Name is required"),
  cat_description: string().min(1, "Description is required"),
  CategoryImg: z.instanceof(File).optional(),
});

export type ICreateUpdateCategory = TypeOf<typeof createUpdateCategorySchema>;
const page = () => {
  const token = useAccessToken();

  const queryClient = useQueryClient();
  const { isLoading, mutate: createCategory } = useMutation(
    (category: FormData) => createCategoryFn(category, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        toast.success("Category created successfully");
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

  const methods = useForm<ICreateUpdateCategory>({
    resolver: zodResolver(createUpdateCategorySchema),
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

  const onSubmitHandler: SubmitHandler<ICreateUpdateCategory> = (values) => {
    const formData = new FormData();

    formData.append("cat_name", values.cat_name);
    formData.append("cat_description", values.cat_description);
    if (values.CategoryImg !== undefined) {
      formData.append("CategoryImg", values.CategoryImg);
    }
    createCategory(formData);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Add Category</h1>
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

export default page;
