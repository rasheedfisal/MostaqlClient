"use client";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { number, object, string, TypeOf, z } from "zod";
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
import { getQuestionFn, updateQuestionFn } from "../../../api/questionsApi";
import FormTextArea from "../../../../components/FormTextArea";

type PageProps = {
  params: {
    qId: string;
  };
};

export const updateQuestionSchema = object({
  question: string().min(1, "Question is required"),
  answer: string().min(1, "Answer is required"),
  order_no: z
    .string()
    .min(1)
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
}).partial();

export type IUpdateQuestion = TypeOf<typeof updateQuestionSchema>;

const page = ({ params: { qId } }: PageProps) => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isDataLoading } = useQuery(
    ["getQuestion", qId],
    () => getQuestionFn(qId, token),
    {
      select: (data) => data,
      retry: 1,
      onSuccess: (data) => {
        if (data) {
          methods.reset({
            question: data.question,
            answer: data.answer,
            order_no: data.order_no.toString(),
          });
        }
      },
      onError: (error) => {
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  const { isLoading, mutate: updateQuestion } = useMutation(
    ({
      id,
      data,
      accessToken,
    }: {
      id: string;
      data: IUpdateQuestion;
      accessToken: string;
    }) => updateQuestionFn({ id, data, accessToken }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["questions"]);
        toast.success("Question updated successfully");
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

  const methods = useForm<IUpdateQuestion>({
    resolver: zodResolver(updateQuestionSchema),
  });

  if (isDataLoading) {
    return <p>Loading...</p>;
  }

  const onSubmitHandler: SubmitHandler<IUpdateQuestion> = (values) => {
    updateQuestion({ id: qId, data: values, accessToken: token });
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Update Common Question</h1>
        <Link
          href="/questions"
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
                <FormInput label="Question" type="text" name="question" />
              </div>
              <div className="grid grid-cols-1">
                <FormTextArea label="Answer" rows={12} name="answer" />
              </div>
              <div className="grid grid-cols-1">
                <FormInput label="Order" type="number" name="order_no" />
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
