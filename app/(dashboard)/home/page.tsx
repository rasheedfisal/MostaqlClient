"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// import { useStateContext } from "../../../context/AppConext";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import useAccessToken from "../../../hooks/useAccessToken";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatisticsFn } from "../../api/siteInfoApi";
import { toast } from "react-toastify";
import { getMonthName, USDollar } from "../../api/currencyFormatter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const home = () => {
  const token = useAccessToken();

  const { isLoading, data: statistics } = useQuery(
    ["statistics"],
    () => getDashboardStatisticsFn(token),
    {
      select: (data) => data,
      retry: 1,
      onError: (error) => {
        // console.log(error);
        if ((error as any).response?.data?.msg) {
          toast.error((error as any).response?.data?.msg, {
            position: "top-right",
          });
        }
      },
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Users Per Role",
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Earnings of ${statistics?.earningPerMonth[0]?.year ?? ""}`,
      },
    },
  };

  const dougnoutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Projects Per Category`,
      },
    },
  };

  const authorizeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Authorized Users`,
      },
    },
  };

  const lineData = {
    labels: statistics?.earningPerMonth.map((a) => getMonthName(a.month)),
    datasets: [
      {
        label: `Total`,
        data: statistics?.earningPerMonth.map((a) => a.earning_per_month),
        // backgroundColor: "rgba(255, 99, 132, 0.5)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: [78, 88, 65, 45, 47, 21, 56, 23, 47],
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  const data = {
    labels: statistics?.userRoles.map((a) => a.role_name),
    datasets: [
      {
        label: "Users",
        data: statistics?.userRoles.map((a) => a.count),
        // backgroundColor: "rgba(255, 99, 132, 0.5)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const authorizedData = {
    labels: statistics?.authorizedUsers.map((a) =>
      a.is_authorized ? "Authorized" : "UnAuthorized"
    ),
    datasets: [
      {
        label: "Authorized",
        data: statistics?.authorizedUsers.map((a) => {
          if (a.is_authorized) {
            return a.count;
          }
        }),
        backgroundColor: "rgba(46, 204, 113, 0.5)",
      },
      {
        label: "UnAuthorized",
        data: statistics?.authorizedUsers.map((a) => {
          if (!a.is_authorized) {
            return a.count;
          }
        }),
        backgroundColor: "rgba(255, 60, 24, 0.5)",
      },
    ],
  };

  const dataDoughnut = {
    labels: statistics?.projectCategory.map((a) => a.cat_name),
    datasets: [
      {
        label: "Project Per Categories",
        data: statistics?.projectCategory.map((a) => a.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* <!-- Content header --> */}
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <a
          href="#"
          // href="https://github.com/Kamona-WD/kwd-dashboard"
          // target="_blank"
          className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
        >
          Explore
        </a>
      </div>
      <div className="mt-2">
        {/* <!-- State cards --> */}
        <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:grid-cols-4">
          {/* <!-- Value card --> */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Earnings
              </h6>
              <span className="text-xl font-semibold">
                {USDollar.format(statistics?.statistics.earnings ?? 0)}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +4.4%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* <!-- Users card --> */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Active Users
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.usersCount}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +2.6%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* <!-- Orders card --> */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Current Commission
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.currentCommision}%
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +3.1%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* <!-- Tickets card --> */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Open Projects
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.openProjects}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +3.1%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Ongoing Projects
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.ongoingProjects}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +2.1%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Completed Projects
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.completedProjects}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +0.1%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Closed Projects
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.closedProjects}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                0.0%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Close Requests
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.closedProjectRequests}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +0.1%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Complete Requests
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.completedProjectRequests}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +3.1%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Account Feed Requests
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.accountFeedRequests}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +4.4%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
            <div>
              <h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                Money Withdrawal Requests
              </h6>
              <span className="text-xl font-semibold">
                {statistics?.statistics.moneyWithdrawalRequests}
              </span>
              <span className="inline-block px-2 py-px ml-2 text-xs text-green-500 bg-green-100 rounded-md">
                +4.4%
              </span>
            </div>
            <div>
              <span>
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* <!-- Charts --> */}
        {/* <!-- One grid columns --> */}
        <div className="grid grid-cols-1 p-4 space-y-8">
          {/* <!-- Bar chart card --> */}
          <div className="bg-white rounded-md dark:bg-darker">
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                User Roles
              </h4>
            </div>
            <div className="p-4 w-auto h-auto">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 p-4 space-y-8">
          {/* <!-- Bar chart card --> */}
          <div className="bg-white rounded-md dark:bg-darker">
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                Authorized Users
              </h4>
            </div>
            <div className="p-4 w-auto h-auto">
              <Bar data={authorizedData} options={authorizeOptions} />
            </div>
          </div>
        </div>

        {/* <!-- One grid columns --> */}
        <div className="grid grid-cols-1 p-4 space-y-8">
          {/* <!-- Doughnut chart card --> */}
          <div className="bg-white rounded-md dark:bg-darker">
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                Project Categories
              </h4>
            </div>
            <div className="flex items-center justify-center w-full">
              <div className="relative h-auto p-4">
                <Doughnut data={dataDoughnut} options={dougnoutOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* <!-- One grid columns --> */}
        <div className="grid grid-cols-1 p-4 space-y-8">
          {/* <!-- Line chart card --> */}
          <div className="bg-white rounded-md dark:bg-darker">
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                Earnings
              </h4>
            </div>
            <div className="p-4 h-auto w-auto">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default home;
