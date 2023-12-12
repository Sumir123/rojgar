import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineDollar } from "react-icons/ai";
import { useQuery } from "react-query";
import { useStoreState } from "../../store";
import illustration from "../images/HeroIllustration.png";
import illustration2 from "../images/illustration3.png";

const HeroSection = () => {
  const { getCategories, getJobs } = useStoreState();
  const {
    isLoading: categoryLoading,
    data: categoryData,
    isError: categoryIsError,
    error: categoryError,
  } = useQuery("categories", () => {
    return getCategories();
  });

  const [page, setPage] = useState("last");

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => {
      return getJobs(page);
    },
  });
  const shuffledCategories = categoryData
    ? categoryData.sort(() => Math.random() - 0.5)
    : [];

  const randomCategories = shuffledCategories.slice(0, 12);
  return (
    <>
      <div className="px-4 md:px-12 md:pb-10 bg-gray-100">
        <div className="md:py-10 flex flex-col-reverse md:flex-row md:items-center">
          <div className="">
            <h1 className="mb-10 text-primary text-4xl font-header font-semibold md:text-5xl lg:text-8xl ">
              Revolutionizing Talent Acquisition
            </h1>
            <p className="text-gray-600 text-lg mb-10 md:text-2xl">
              Say Goodbye to Traditional Hiring Methods and Welcome Top Talent
              with Open Arm
            </p>
            <Link
              href="/account/signup"
              className="bg-[#4197E1] text-gray-50 rounded-md px-6 py-2"
            >
              Get Started
            </Link>
          </div>
          <div className="">
            <Image
              src={illustration}
              width={1000}
              height={500}
              alt="illustration"
            />
          </div>
        </div>
        <div className="py-20 md:grid md:grid-cols-2 items-center  ">
          <div className="md:border md:overflow-hidden flex items-center justify-center">
            <Image className="-mt-5 md:block" src={illustration2} alt="" />
          </div>
          <div className="md:ml-8">
            <div className="">
              <h1 className="text-primary font-header font-medium text-3xl mb-4">
                Elevate Your Business with Affordable Talent
              </h1>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Search for the Best Jobs
                </h3>
                <p className=" text-sm">
                  Find your dream job by browsing thousands of job listings from
                  top employers across different industries and locations.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Post a job and hire top talent.
                </h3>
                <p className=" text-sm">
                  Finding talent doesn’t have to be a chore. Post a job or we
                  can search for you!
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Discover Your Next Job Opportunity
                </h3>
                <p className="text-sm">
                  Our advanced recommendation system suggests jobs based on your
                  skills and experience, so you can find the right job that
                  matches your career goals.
                </p>
              </div>
            </div>
            <div className="flex gap-4 py-5">
              <button className="bg-[#4197E1] px-6 py-2 text-gray-50 rounded-3xl hover:bg-[#2586db]">
                Signup for free
              </button>
              <button className="border-[#4197E1] border-2  px-6 py-2 text-[#4197E1] rounded-3xl hover:bg-slate-200">
                Learn to hire
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-100  md:py-14">
          <div className="flex justify-between items-center mb-6 ">
            <h1 className="text-xl md:text-2xl text-blue-500  font-semibold font-header">
              Browse talent by category
            </h1>
            <Link href="/job/category" className="text-blue-500">
              see all
            </Link>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {randomCategories.map((category) => (
              <Link
                href={`/job/category/${category.name}`}
                key={category.id}
                className="bg-white md:text-x px-4 py-2 flex flex-col justify-between border rounded-lg border-gray-300 shadow-md hover:shadow-xl group transition duration-300 ease-in-out"
              >
                <div className="text-lg font-semibold group-hover:text-blue-700">
                  {category.name}
                </div>
                <br />
                <div className="text-xs text-gray-700">
                  {category.job_count} jobs
                </div>
              </Link>
            ))}
          </ul>
        </div>
        <div className="bg-slate-100   ">
          <div className="py-16">
            <h2 className="text-xl md:text-2xl text-blue-500  font-semibold mb-6 font-header">
              Latest Job Openings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {data?.jobs.slice(0, 6).map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-4 border rounded-lg border-gray-300 shadow-md hover:shadow-xl transition duration-300 ease-in-out "
                >
                  <Link href={`/job/${job._id}`}>
                    <h3 className="text-xl font-semibold hover:text-blue-700 mb-2">
                      {job.title}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-2  text-gray-600">
                    <AiOutlineDollar size={23} className=" mr-2" />
                    <p className="text-sm">{job.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <p className="text-sm font-semibold">{job.category}</p>
                  </div>
                  <p className="text-sm text-gray-700 truncate">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
