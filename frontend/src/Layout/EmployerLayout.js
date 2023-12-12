import React, { useState } from 'react';
import { FaBriefcase, FaDashcube, FaNetworkWired, FaUserFriends } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { QueryClient, useQuery } from 'react-query';
import { useStoreState } from '../../store';
import Logo from '../images/favicon2.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const EmployerLayout = ({ children }) => {
  const { currentUser, clearAllUserData, getCurrentUser } = useStoreState();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    clearAllUserData();
    router.push('/account/login');
  };

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  return (
    <div className="flex h-screen">
      <aside className={`bg-gray-800 text-white flex-shrink-0 w-1/3 md:w-1/6 ${showSidebar ? 'block' : 'hidden'} md:block`}>
        <nav className="py-4 px-4 flex flex-col overflow-y-auto h-full">
          <div className="flex-1">
            <Link href="/">
              <Image
                className="block px-2 mb-3 h-8 w-auto"
                src={Logo}
                alt="Rojgar Logo"
              />
            </Link>
            <ul className="space-y-4">
            <Link
                className={`flex items-center py-2 px-4 space-x-2 cursor-pointer ${
                  router.pathname === "/employer/dashboard"
                    ? "text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                href="/employer/dashboard"
              >
                <FaDashcube size={20} />
                <li className="">Dashboard</li>
              </Link>
              <Link
                className={`flex items-center py-2 px-4 space-x-2 cursor-pointer ${
                  router.pathname === "/employer/postJobs"
                    ? "text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                href="/employer/postJobs"
              >
                <FaBriefcase size={20} />
                <li className="">Post Jobs</li>
              </Link>
              <Link
                className={`flex items-center py-2 px-4 space-x-2 cursor-pointer ${
                  router.pathname === "/employer/viewJobs"
                    ? "text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                href="/employer/viewJobs"
              >
                <FaNetworkWired size={20} />
                <li className="">View Jobs</li>
              </Link>
              <Link
                className={`flex items-center py-2 px-4 space-x-2 cursor-pointer ${
                  router.pathname === "/employer/viewApplications"
                    ? "text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                href="/employer/viewApplications"
              >
                <FaUserFriends size={20} />
                <li className="">View Applicants</li>
              </Link>
            </ul>
          </div>
          <div className="">
            <div className="flex gap-2 items-center py-2 px-4 ">
              <Link href="/employer/my_profile" className="hover:underline">
                {data?.name}
              </Link>
            </div>
            <div
              className="flex cursor-pointer gap-2 items-center py-2 px-4 hover:bg-gray-700"
              onClick={handleLogout}
            >
              <FiLogOut /> Log out
            </div>
          </div>
        </nav>
      </aside>
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <svg
            className={`w-6 h-6 ${showSidebar ? 'hidden' : 'block'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <main className="flex-1 pt-4 overflow-y-auto">{children}</main>
    </div>
  );
};

export default EmployerLayout;
