"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { number, object, string, TypeOf, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FormInput from "../../../../components/FormInput";
import SubmitButton from "../../../../components/SubmitButton";
import useAccessToken from "../../../../hooks/useAccessToken";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";
import { createPriceFn } from "../../../api/pricesApi";

const createUpdatePriceSchema = object({
  range_name: string().min(1, "Name is required"),
  range_from: z
    .string()
    .min(1)
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  range_to: z
    .string()
    .min(1)
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
});

export type ICreateUpdatePrice = TypeOf<typeof createUpdatePriceSchema>;
const page = () => {
  const token = useAccessToken();

  const queryClient = useQueryClient();
  const { isLoading, mutate: createPrice } = useMutation(
    (price: ICreateUpdatePrice) => createPriceFn(price, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["prices"]);
        toast.success("Price Range created successfully");
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

  const methods = useForm<ICreateUpdatePrice>({
    resolver: zodResolver(createUpdatePriceSchema),
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

  const onSubmitHandler: SubmitHandler<ICreateUpdatePrice> = (values) => {
    createPrice(values);
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Add Price Range</h1>
        <Link
          href="/prices"
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
                <FormInput label="Name" type="text" name="range_name" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FormInput label="Range From" type="text" name="range_from" />
                <FormInput label="Range To" type="text" name="range_to" />
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
