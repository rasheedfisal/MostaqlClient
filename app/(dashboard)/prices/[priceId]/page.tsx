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
import { getPriceFn, updatePriceFn } from "../../../api/pricesApi";

type PageProps = {
  params: {
    priceId: string;
  };
};

const updatePriceSchema = object({
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
}).partial();

export type IUpdatePrice = TypeOf<typeof updatePriceSchema>;

const page = ({ params: { priceId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isPriceLoading, data, isSuccess } = useQuery(
    {
      queryKey: ["getPrice", priceId],
      queryFn: () => getPriceFn(priceId, token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updatePrice } = useMutation(
    
    {
      mutationFn: ({
      id,
      price,
      accessToken,
    }: {
      id: string;
      price: IUpdatePrice;
      accessToken: string;
    }) => updatePriceFn({ id, price, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["prices"]});
        toast.success("Price updated successfully");
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

  const methods = useForm<IUpdatePrice>({
    resolver: zodResolver(updatePriceSchema),
  });

  if (isSuccess) {
    methods.reset({
            range_name: data.range_name,
            range_from: data.range_from.toString(),
            range_to: data.range_to.toString(),
          });
  }

  if (isPriceLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpdatePrice> = (values) => {
    updatePrice({ id: priceId, price: values, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Update Prices</h1>
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
