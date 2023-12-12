import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoMenu, IoSearchOutline } from "react-icons/io5";
import { useQuery } from "react-query";
import { useStoreState } from "../../store";
import Logo from "../images/favicon2.png";

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { currentUser, setCurrentUser, clearAllUserData, getCurrentUser } =
    useStoreState();
  const router = useRouter();
  const path = router.asPath;

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    clearAllUserData();
    router.push("/account/login");
  };

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 60000,
  });

  const SearchBar = () => {
    return (
      <div className="md:block center relative">
        <form>
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-1 border outline-none rounded-3xl text-gray-500 focus:border-gray-400"
          />
        </form>
        <IoSearchOutline
          className="absolute top-1 right-2 text-gray-400 cursor-pointer"
          size={23}
          onClick={() => SearchBar(!SearchBar)}
        />
      </div>
    );
  };

  const renderAuthButtons = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClick = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [menuRef]);

    if (Object.keys(currentUser).length !== 0) {
      return (
        <>
          <div className="flex items-center justify-center  text-gray-500 text-center gap-4 relative">
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center justify-center gap-4 text-lg font-medium text-gray-700 hover:text-primary focus:outline-none"
                onClick={handleClick}
                aria-controls="account-menu"
                aria-haspopup="true"
                aria-expanded={isOpen ? "true" : "false"}
              >
                <div className="flex-shrink-0">
                  <FaUser />
                </div>
                <div className="hidden md:flex flex-col">
                  <div className="text-base font-semibold">
                    {isLoading && "loading"}
                    {isError && error.message}
                    {currentUser.name ? currentUser.name : ""}
                  </div>
                </div>
              </button>
              {isOpen && (
                <div className="absolute right-0 w-56 top-full z-50 bg-white rounded-md shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-300">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex flex-col">
                        <div className="font-medium">{currentUser.role}</div>
                        <div className="text-sm text-gray-400">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-secondary"
                    >
                      <div className="flex items-center space-x-2">
                        <AiOutlineUser className="w-5 h-5" />
                        <span className="font-medium">My Profile</span>
                      </div>
                    </Link>
                    <button
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-secondary text-left w-full"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center space-x-2">
                        <FiLogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="flex items-center gap-4">
          <Link
            href="/account/login"
            className="px-3 py-1 text-[#4197E1] rounded-3xl"
          >
            Login
          </Link>
          <Link
            href="/account/signup"
            className="bg-[#4197E1] px-3 py-1 text-gray-50 rounded-3xl"
          >
            Signup
          </Link>
        </div>
      );
    }
  };

  return (
    <>
      <nav className="bg-slate-100 text-slate-900 z-10 shadow-md sticky px-4 md:px-12 py-5">
        <div className="flex items-center justify-between ">
          <div className="flex">
            {/* Mobile menu icon */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white duration-200 md:hidden"
              onClick={handleMenuClick}
            >
              <span className="sr-only">Open main menu</span>
              <IoMenu size={25} />
            </button>

            <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start duration-200">
              <Link href="/" passHref>
                <Image
                  className="block h-8 w-auto"
                  src={Logo}
                  alt="Rojgar Logo"
                />
              </Link>
              <div className="hidden md:ml-6 md:block">
                <div className="flex space-x-0">
                  {Object.keys(currentUser).length === 0 && (
                    <Link
                      href="/find-jobs"
                      passHref
                      className={`px-3 py-2 text-sm font-medium ${
                        path === "/find-jobs" && "border-b border-slate-600"
                      } hover:text-[#4197E1]`}
                      aria-current="page"
                    >
                      Find Jobs
                    </Link>
                  )}

                  <Link
                    href="/job/category"
                    passHref
                    className={`px-3 py-2 text-sm font-medium ${
                      path === "/job/category" && "border-b border-slate-600"
                    } hover:text-[#4197E1]`}
                  >
                    Job Category
                  </Link>
                  {currentUser.role === "jobseeker" && (
                    <Link
                      href="/jobseeker/appliedJobs"
                      passHref
                      className={`px-3 py-2 text-sm font-medium ${
                        path === "/jobseeker/appliedJobs" &&
                        "border-b border-slate-600"
                      } hover:text-[#4197E1]`}
                    >
                      Applied jobs
                    </Link>
                  )}
                  {currentUser.role === "jobseeker" && (
                    <Link
                      href="/jobseeker/recomended-jobs"
                      passHref
                      className={`px-3 py-2 text-sm font-medium ${
                        path === "/jobseeker/recomended-jobs" &&
                        "border-b border-slate-600"
                      } hover:text-[#4197E1]`}
                    >
                      Recommended jobs
                    </Link>
                  )}
                  {/* <Link
                    href="#"
                    className="px-3 py-2 text-sm font-medium hover:text-[#4197E1]"
                    passHref
                  >
                    Contact us
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">{renderAuthButtons()}</div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:hidden bg-slate-100`}
        >
          {(Object.keys(currentUser).length === 0 ||
            currentUser.role === "employer") && (
            <Link
              href="/find-jobs"
              className="block px-4 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Find Jobs
            </Link>
          )}
          {(Object.keys(currentUser).length === 0 ||
            currentUser.role === "employer") && (
            <Link
              href="/find-talent"
              className="block px-4 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Find Talent
            </Link>
          )}
          <Link
            href="/job_category"
            className="block px-4 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
          >
            Job Category
          </Link>
          {/* <Link
            href="#"
            className="block px-4 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
          >
            About us
          </Link>
          <Link
            href="#"
            className="block px-4 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
          >
            Contact us
          </Link> */}
        </div>
      </nav>
      {/* <div className="py-20 px-12  bg-gray-100">{children}</div> */}

      <main className="">{children}</main>

      <footer className="bg-slate-900 text-slate-100 py-10 px-4 md:px-12">
        <div className="flex justify-between items-center">
          <p className="">© 2023 Rojgar. All rights reserved.</p>
          <ul className="md:flex space-x-4 items-center hidden ">
            <li>
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
