"use client";

import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { formatDistance, subDays, format, parseISO } from "date-fns";
import Link from "next/link";
import { toast } from "react-toastify";
import useAccessToken from "../../../../hooks/useAccessToken";
import { getProjectOffersFn } from "../../../api/projectsApi";

type PageProps = {
  params: {
    projId: string;
  };
};
const page = ({ params: { projId } }: PageProps) => {
  const datetest = format(new Date(), "yyyy-MM-dd");
  const token = useAccessToken();

  const { isLoading, data: offers } = useQuery(
    ["projectOffer"],
    () => getProjectOffersFn(token, projId, 1, 10),
    {
      select: (data) => data,
      retry: 1,
      staleTime: 0,
      cacheTime: 0,
      onError: (error) => {
        // console.log(error);
        if ((error as any).response?.data?.msg?.message) {
          toast.error((error as any).response?.data?.msg?.message, {
            position: "top-right",
          });
        }
      },
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Offers</h1>
        <Link
          href="/projects"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base">offer List</h3>
              </div>
            </div>
          </div>
          <div className="block w-full relative overflow-x-auto">
            <div className="flex items-center justify-center flex-wrap gap-5">
              {offers?.results.map((offer) => (
                <div
                  key={offer.id}
                  className="max-w-md px-10 my-4 py-6 dark:bg-primary-lighter bg-gray-100 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="block md:flex items-center">
                        <img
                          className="mx-4 w-10 h-10 object-cover rounded-full"
                          src={offer.client.imgPath ?? "noImg.jpg"}
                          alt="avatar"
                          loading="lazy"
                        />
                        <span className="flex flex-col text-sm">
                          <p className="text-gray-700 font-bold">
                            {offer.client.fullname}
                          </p>
                          <p className="text-gray-400 dark:text-gray-700 font-bold">
                            {offer.client.userprofiles.specialization}
                          </p>
                        </span>
                      </div>
                    </div>
                    <span className="font-light text-gray-600">
                      {formatDistance(
                        parseISO(offer.createdAt.toString()),
                        subDays(new Date(), 0),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex gap-2 md:gap-5 flex-wrap">
                      <div className="flex justify-start items-center gap-1 text-sm">
                        <span className=" text-gray-700 font-bold hover:text-gray-600">
                          Price Offer:
                        </span>
                        <p className="text-gray-600">{offer.price}</p>
                      </div>

                      <div className="flex justify-start items-center gap-1 text-sm">
                        <span className=" text-gray-700 font-bold hover:text-gray-600">
                          Days:
                        </span>
                        <p className=" text-gray-600">
                          {offer.days_to_deliver}
                        </p>
                      </div>
                      <div className="flex justify-start items-center gap-1 text-sm">
                        <span className=" text-gray-700 font-bold hover:text-gray-600">
                          Attachment:{" "}
                        </span>
                        {offer.pdf_url ? (
                          <Link
                            href={offer.pdf_url}
                            target="_blank"
                            className="text-blue-700 underline"
                          >
                            click to view
                          </Link>
                        ) : (
                          "None"
                        )}
                      </div>
                      <div className="flex flex-1 justify-start items-center gap-1 text-sm">
                        <span className=" text-gray-700 font-bold hover:text-gray-600">
                          Description:
                        </span>
                        <p className=" text-gray-600">{offer.message_desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
