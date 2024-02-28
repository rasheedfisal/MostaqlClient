"use client";
import Card, { CallbackArgument, Focused } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  // formatFormData
} from "./FormatCards";

import { getCreditCardFn, updateCreditCardFn } from "../../api/siteInfoApi";
import { toast } from "react-toastify";

import React, { ChangeEvent, FormEvent, useState } from "react";
import SubmitButton from "../../../components/SubmitButton";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import useAccessToken from "../../../hooks/useAccessToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ICard {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  issuer: string;
  focused?: string;
}

const page = () => {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { isLoading: isItemsLoading, isSuccess, error, data } = useQuery(
    {
      queryKey: ["getCreditCard"],
      queryFn: () => getCreditCardFn(token),
      select: (data) => data,
      retry: 1
    }
  );

  const { isPending, mutate: updateItem } = useMutation(
    
    {
      mutationFn: ({ data, accessToken }: { data: ICard; accessToken: string }) =>
      updateCreditCardFn({ data, accessToken }),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["getCreditCard"]});
        toast.success("Credit Card updated successfully");
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

  const [cardState, setCardState] = useState<ICard>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
  });

  const handleCallback = ({ issuer }: CallbackArgument, isValid: boolean) => {
    if (isValid) {
      setCardState((prev) => ({ ...prev, issuer }));
    } else {
      setCardState((prev) => ({ ...prev, issuer: "" }));
    }
  };

  const handleInputFocus = ({
    target,
  }: React.FocusEvent<HTMLInputElement, Element>) => {
    setCardState((prev) => ({ ...prev, focused: target.name }));
  };
  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }

    setCardState((prev) => ({ ...prev, [target.name]: target.value }));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cardState.issuer === null || cardState.issuer === "") {
      toast.error("Credit Card is Not Valid", {
        position: "top-right",
      });
    } else {
      updateItem({ data: cardState, accessToken: token });
    }
  };


   if (isSuccess) {
    setCardState((prev) => ({ ...prev, ...data }));
  }

  if (error !== null) {
    toast.error(error.message, {
      position: "top-right",
    });
  }

  if (isItemsLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
      <div className="border-r lg:block border-gray-300 lg:col-span-1">
        <div className="py-5">
          <Card
            number={cardState.number}
            name={cardState.name}
            expiry={cardState.expiry}
            cvc={cardState.cvc}
            focused={
              cardState.focused === "cvc"
                ? "cvc"
                : cardState.focused === "expiry"
                ? "expiry"
                : cardState.focused === "name"
                ? "name"
                : "number"
            }
            callback={handleCallback}
          />
        </div>
      </div>
      <div className="lg:col-span-2 border-r">
        <form
          className="flex flex-wrap gap-3 w-full p-5"
          onSubmit={handleSubmit}
        >
          <label className="relative w-full flex flex-col">
            <span className="font-bold mb-3">Name</span>
            <input
              className="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 dark:text-gray-600"
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              value={cardState.name}
              required
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
              stroke="currentColor"
              fill="none"
            >
              <path
                fillRule="evenodd"
                strokeWidth="2"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <label className="relative w-full flex flex-col">
            <span className="font-bold mb-3">Card number</span>
            <input
              className="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 dark:text-gray-600"
              type="text"
              name="number"
              pattern="[\d| ]{16,22}"
              placeholder="0000 0000 0000"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              value={cardState.number}
              required
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </label>

          <label className="relative w-full md:flex-1 flex flex-col">
            <span className="font-bold mb-3">Expire date</span>
            <input
              className="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 dark:text-gray-600"
              type="text"
              name="expiry"
              placeholder="MM/YY"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              value={cardState.expiry}
              required
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </label>

          <label className="relative w-full md:flex-1 flex flex-col">
            <span className="font-bold flex items-center gap-3 mb-3">
              CVC/CVV
              <span className="relative group">
                <span className="hidden group-hover:flex justify-center items-center px-2 py-1 text-xs absolute -right-2 transform translate-x-full -translate-y-1/2 w-max top-1/2 bg-black text-white">
                  {" "}
                  A Card Verification Value (CVV or CVV2) or Card Verification
                  Code (CVC) !
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </span>
            <input
              className="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 dark:text-gray-600"
              type="text"
              name="cvc"
              placeholder="&bull;&bull;&bull;&bull;"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              value={cardState.cvc}
              required
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </label>

          {/* <input type="hidden" name="issuer" value={cardState.issuer} /> */}

          <div className="relative w-full flex flex-col">
            <SubmitButton
              title="Submit"
              clicked={isPending}
              loadingTitle="loading..."
              icon={<DocumentPlusIcon className="h-5 w-5" />}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
