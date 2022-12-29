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
  // const stateContext = useStateContext();

  // useUpdateEffect(() => {
  //   console.log("userCred", stateContext.state.authUser);
  //   console.log("tokenCred", stateContext.tokenState.token);
  // }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [22, 25, 56, 75, 47, 88, 96, 44, 12],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: [78, 88, 65, 45, 47, 21, 56, 23, 47],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const dataDoughnut = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
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

  const random = (max = 100) => {
    return Math.round(Math.random() * max) + 20;
  };

  const randomData = () => {
    return [
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
    ];
  };

  const [users, setUsers] = useState([
    {
      name: "rasheed",
      id: 1,
    },
    {
      name: "ahmed",
      id: 2,
    },
    {
      name: "khaled",
      id: 3,
    },
    {
      name: "ali",
      id: 4,
    },
    {
      name: "hamza",
      id: 5,
    },
  ]);

  const [userCount, setUserCount] = useState(users.length);

  const userData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "Dataset 1",
        data: users.map((user) => user.id),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: 0,
        categoryPercentage: 1,
      },
    ],
  };

  useUpdateEffect(() => {
    const interval = setInterval(() => {
      const newUsers = users.map((user) => {
        return { ...user, id: random() };
      });

      const addnewuser = [
        ...newUsers,
        { name: `name ${random()}`, id: random() },
      ];
      setUserCount((prev) => prev + 1);
      setUsers(addnewuser);
      if (users.length > 6) {
        setUsers((prev) => prev.slice(-4));
      }
    }, 2000);
    // console.log(users);
    return () => clearInterval(interval);
  }, [users]);

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
                Value
              </h6>
              <span className="text-xl font-semibold">$30,000</span>
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
                Users
              </h6>
              <span className="text-xl font-semibold">50,021</span>
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
                Orders
              </h6>
              <span className="text-xl font-semibold">45,021</span>
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
                Tickets
              </h6>
              <span className="text-xl font-semibold">20,516</span>
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
        </div>

        {/* <!-- Charts --> */}
        <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
          {/* <!-- Bar chart card --> */}
          <div
            className="col-span-2 bg-white rounded-md dark:bg-darker"
            // x-data="{ isOn: false }"
          >
            {/* <!-- Card header --> */}
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                Bar Chart
              </h4>
              {/* <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-light">
                Last year
              </span>
              <button
                className="relative focus:outline-none"
                // x-cloak
                // @click="isOn = !isOn; $parent.updateBarChart(isOn)"
              >
                <div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"></div>
                <div
                  className="absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm"
                  // :className="{ 'translate-x-0  bg-white dark:bg-primary-100': !isOn, 'translate-x-6 bg-primary-light dark:bg-primary': isOn }"
                ></div>
              </button>
            </div> */}
            </div>
            {/* <!-- Chart --> */}
            <div className="relative p-4 h-72 w-full">
              {/* <canvas id="barChart"></canvas> */}
              <Bar data={data} options={options} />
            </div>
          </div>

          {/* <!-- Doughnut chart card --> */}
          <div
            className="bg-white rounded-md dark:bg-darker"
            // x-data="{ isOn: false }"
          >
            {/* <!-- Card header --> */}
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                Doughnut Chart
              </h4>
              {/* <div className="flex items-center">
              <button
                className="relative focus:outline-none"
                // x-cloak
                // @click="isOn = !isOn; $parent.updateDoughnutChart(isOn)"
              >
                <div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"></div>
                <div
                  className="absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm"
                  // :className="{ 'translate-x-0  bg-white dark:bg-primary-100': !isOn, 'translate-x-6 bg-primary-light dark:bg-primary': isOn }"
                ></div>
              </button>
            </div> */}
            </div>
            {/* <!-- Chart --> */}
            <div className="relative p-4 h-72">
              {/* <canvas id="doughnutChart"></canvas> */}
              <Doughnut data={dataDoughnut} options={options} />
            </div>
          </div>
        </div>

        {/* <!-- Two grid columns --> */}
        <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
          {/* <!-- Active users chart --> */}
          <div className="col-span-1 bg-white rounded-md dark:bg-darker">
            {/* <!-- Card header --> */}
            <div className="p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                Active users right now
              </h4>
            </div>
            <p className="p-4">
              <span
                className="text-2xl font-medium text-gray-500 dark:text-light"
                id="usersCount"
              >
                {userCount}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-primary">
                Users
              </span>
            </p>
            {/* <!-- Chart --> */}
            <div className="relative p-4">
              {/* <canvas id="activeUsersChart"></canvas> */}
              <Bar data={userData} options={options} />
            </div>
          </div>

          {/* <!-- Line chart card --> */}
          <div
            className="col-span-2 bg-white rounded-md dark:bg-darker"
            // x-data="{ isOn: false }"
          >
            {/* <!-- Card header --> */}
            <div className="flex items-center justify-between p-4 border-b dark:border-primary">
              <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
                Line Chart
              </h4>
              {/* <div className="flex items-center">
              <button
                className="relative focus:outline-none"
                // x-cloak
                // @click="isOn = !isOn; $parent.updateLineChart()"
              >
                <div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-darker"></div>
                <div
                  className="absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform scale-110 rounded-full shadow-sm"
                  // :className="{ 'translate-x-0  bg-white dark:bg-primary-100': !isOn, 'translate-x-6 bg-primary-light dark:bg-primary': isOn }"
                ></div>
              </button>
            </div> */}
            </div>
            {/* <!-- Chart --> */}
            <div className="relative p-4 h-72">
              {/* <canvas id="lineChart"></canvas> */}
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default home;
