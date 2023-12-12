import { getApplication, getJobs, getMyApplication } from "@/api";
import ApplyModal from "@/component/modal/ApplyModal";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { ImPriceTag } from "react-icons/im";
import { useStoreState } from "../../../../store";
import EmployerLayout from "@/Layout/EmployerLayout";
import { AiOutlineLeft } from "react-icons/ai";
import EditJobModal from "@/component/modal/EditJobModal";
import ViewApplications from "../viewApplications";
import ApplicationCard from "@/component/ApplicationCard";
import DeleteJobModal from "@/component/modal/DeleteJobModal";

const JobDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { currentUser, getCategories } = useStoreState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    isLoading: categoryLoading,
    data: categoryData,
    isError: categoryIsError,
    error: categoryError,
  } = useQuery("categories", () => {
    return getCategories();
  });
  const shuffledCategories = categoryData
    ? categoryData.sort(() => Math.random() - 0.5)
    : [];
  const randomCategories = shuffledCategories.slice(0, 10);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => {
      return getJobs({ id: id });
    },
    enabled: !!id,
  });

  const applicationData = useQuery({
    queryKey: ["MyApplication"],
    queryFn: getApplication,
    enabled: !!currentUser?._id,
  });

  const myAppliedApplications = Object.values(applicationData?.data || []);
  const job = data?.jobs[0];

  const hasApplied = myAppliedApplications.some(
    (application) => application.job_id === job?._id
  );

  const skillsArray =
    Array.isArray(job?.skills) || job?.skills?.length === 0
      ? job?.skills
      : job?.skills?.split(",")?.slice(0, 5);

  const myApplications = useQuery("myApplications", getMyApplication);
  return (
    <>
      <div className="flex flex-col md:flex-row pt-4 px-8 items-baseline">
        <div className=" w-full pb-8 ">
          <div
            className="flex gap-2 items-center text-gray-500 hover:text-black cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            <AiOutlineLeft /> back
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-medium mb-4">Job Details</h2>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white font-semibold px-4 py-0.5 rounded"
                onClick={() => setOpenEditModal(true)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white font-semibold px-4 py-0.5 rounded"
                onClick={() => setOpenDeleteModal(true)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="border p-6 rounded-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-5">
              {job?.title}
            </h3>
            <div className="text-slate-400 text-sm mb-4">
              <Link href={`/job/category/${job?.category}`}>
                <p className="underline text-primary">{job?.category}</p>
              </Link>
              <p>Posted {getTimeDifference(job?.timestamp)}</p>
            </div>
            <hr />
            <div className="my-4">
              {job && job?.description && (
                <p
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: job.description
                      .replace(/\n/g, "<br>")
                      .replace(/\t/g, "&emsp;"),
                  }}
                ></p>
              )}
            </div>
            <hr />
            <div className="flex my-4">
              <div className=" flex items-center gap-4 ">
                <div className="text-base text-gray-700">
                  <ImPriceTag size={15} />
                </div>
                <div>
                  <p className=" font-medium">{job?.price}</p>
                  <p className="text-gray-400 text-xs">
                    {job?.["payment_type"]}
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div className="text-gray-600 text-sm my-4 ">
              <h1 className="text-gray-700 pb-4 text-base font-medium">
                Skills
              </h1>
              <div className="flex gap-2 flex-wrap">
                {skillsArray?.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-200 text-gray-800 px-[10px] py-[3px] rounded-full text-[12px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar */}
      </div>
      <div className="px-8"></div>

      {openEditModal && (
        <EditJobModal
          onClose={() => setOpenEditModal(false)}
          job={job}
          id={id}
        />
      )}

      {openDeleteModal && (
        <DeleteJobModal
          onClose={() => setOpenDeleteModal(false)}
          job={job}
          id={id}
        />
      )}
    </>
  );
};

JobDetails.Layout = EmployerLayout;
export default JobDetails;

function getTimeDifference(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const timeDifference = Math.abs(now - date);
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return days === 1 ? "1 day ago" : days + " days ago";
  } else if (hours >= 1) {
    return hours === 1 ? "1 hour ago" : hours + " hours ago";
  } else if (minutes >= 1) {
    return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";
  } else {
    return seconds === 1 ? "1 second ago" : seconds + " seconds ago";
  }
}
