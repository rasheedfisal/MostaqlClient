"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput from "../../../../../../components/FormInput";
import SubmitButton from "../../../../../../components/SubmitButton";
import useAccessToken from "../../../../../../hooks/useAccessToken";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useUpdateEffect from "../../../../../../hooks/useUpdateEffect";
import { createSubCategoryFn } from "../../../../../api/categoryApi";

type PageProps = {
  params: {
    catId: string;
  };
};
const createSubCatSchema = object({
  name: string().min(1, "Name is required"),
});

export type ICreateSubCat = TypeOf<typeof createSubCatSchema>;
const Add = ({ params: { catId } }: PageProps) => {
  const token = useAccessToken();

  const queryClient = useQueryClient();
  const { isPending, mutate: createSubCat } = useMutation(
    {
      mutationFn: (subcat: ICreateSubCat) => createSubCategoryFn(catId, subcat, token),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["subcategories", catId]});
        toast.success("Sub Category created successfully");
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

  const methods = useForm<ICreateSubCat>({
    resolver: zodResolver(createSubCatSchema),
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

  const onSubmitHandler: SubmitHandler<ICreateSubCat> = (values) => {
    createSubCat(values);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Add Sub Category</h1>
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

export default Add;
