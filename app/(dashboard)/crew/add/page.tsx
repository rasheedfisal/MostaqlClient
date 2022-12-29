import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

const Add = () => {
  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Add Crew</h1>
        <Link
          href="/crew"
          // href="https://github.com/Kamona-WD/kwd-dashboard"
          // target="_blank"
          className="px-4 py-2 flex items-center text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          <ChevronDoubleLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 p-4">
        <div className="w-full px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker">
          {/* <h1 className="text-xl font-semibold text-start">Add Flight</h1> */}
          {/* <hr /> */}
          <form action="#" className="space-y-6">
            <div className="grid grid-cols-1">
              <div className="flex flex-col w-full">
                <label>Name</label>
                <input
                  className="px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
                  type="text"
                  name="title"
                  // placeholder="Title"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col w-full">
                <label>Email</label>
                <input
                  className="px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
                  type="text"
                  name="origin"
                  // placeholder="Origin"
                  required
                />
              </div>
              <div className="flex flex-col w-full">
                <label>Phone</label>
                <input
                  className="px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
                  type="text"
                  name="destination"
                  // placeholder="Destination"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col w-full">
                <label>Gender</label>
                <select
                  className="w-full px-4 py-1 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
                  name="depart"
                  // placeholder="Depart Time"
                  required
                >
                  <option value="">[-- select gender --]</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label>Address</label>
                <input
                  className="w-full px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
                  type="text"
                  name="arrive"
                  // placeholder="Arrive Time"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <img
                  className="w-20 h-20 rounded-full object-cover object-center"
                  src="https://i1.pngguru.com/preview/137/834/449/cartoon-cartoon-character-avatar-drawing-film-ecommerce-facial-expression-png-clipart.jpg"
                  alt="Avatar Upload"
                />
              </div>
              <label className="cursor-pointer mt-6">
                <span className="mt-2 leading-normal px-4 py-2 text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark rounded-full">
                  Select Avatar
                </span>
                <input type="file" className="hidden" accept="*" multiple />
              </label>
            </div>
            <div className="flex">
              <button
                type="submit"
                className="px-4 py-2 w-full text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
