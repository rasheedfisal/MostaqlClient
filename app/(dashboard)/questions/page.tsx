"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAccessToken from "../../../hooks/useAccessToken";
import { deleteQuestionFn, getAllQuestionsFn } from "../../api/questionsApi";
import EditIcon from "../../../icons/EditIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import TableLoader from "../../../components/TableLoader";
const page = () => {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  const { isLoading, data: questions, error } = useQuery(   
    {
      queryKey: ["questions"],
      queryFn: () => getAllQuestionsFn(token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending: isDeleteing, mutate: deleteQuestion } = useMutation(
    {
      mutationFn: ({ id, accessToken }: { id: string; accessToken: string }) =>
        deleteQuestionFn({ id, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["questions"]});
        toast.success("Question deleted successfully");
      },
      onError: (error) => {
         toast.error(error.message, {position: "top-right"});
      },
    }
  );

  const handleDelete = (id: string) => {
    if (confirm("are you sure you want to delete?")) {
      deleteQuestion({
        id: id,
        accessToken: token,
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error !== null) {
    toast.error(error.message, {position: "top-right"})
  }

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Manage Common Questions</h1>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">
                  Questions and Answers List
                </h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href="/questions/add"
                  className="bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark text-xs font-bold uppercase px-3 py-1 rounded outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <div className="relative">
              {isDeleteing && <TableLoader />}
              <div className="space-y-8">
                {questions?.map((q) => (
                  <div
                    key={q.id}
                    className="border rounded-md border-gray-400 dark:border-gray-700 p-5"
                  >
                    <div className="flex items-start">
                      <div>
                        <span className="inline-flex justify-center items-center w-6 h-6 rounded bg-green-500 text-white font-medium text-sm">
                          Q
                        </span>
                      </div>
                      <p className="ml-4 md:ml-6">{q.question}</p>
                    </div>
                    <div className="flex items-start mt-3">
                      <div>
                        <span className="inline-flex justify-center items-center w-6 h-6 rounded bg-gray-200 text-gray-800 font-medium text-sm">
                          A
                        </span>
                      </div>
                      {/* <p className="ml-4 md:ml-6">{q.answer}</p> */}
                      <textarea
                        className=" w-full ml-4 md:ml-6 border border-gray-400 rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
                        value={q.answer}
                        autoComplete="off"
                        rows={12}
                        readOnly
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:flex md:items-start mt-8">
                      <div className="flex justify-center mt-3 bg-primary hover:bg-primary-lighter rounded-lg px-3 py-2 cursor-pointer group">
                        <span className="text-sm text-white">
                          order: {q.order_no}
                        </span>
                      </div>
                      <div className="flex justify-center mt-3 bg-dark hover:bg-dark-lighter text-white rounded-lg px-3 py-2 cursor-pointer group">
                        <span className="flex justify-between">
                          <Link
                            href={`/questions/${q.id}`}
                            className="w-4 mr-2 mt-1 transform hover:text-purple-700 hover:scale-110"
                          >
                            <EditIcon />
                          </Link>
                          <div
                            onClick={() => handleDelete(q.id)}
                            className="w-4 mr-2 mt-1 transform hover:text-red-700 hover:scale-110"
                          >
                            <DeleteIcon />
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
