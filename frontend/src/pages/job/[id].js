import { getApplication, getJobs, getUserProfile } from "@/api";
import ApplyModal from "@/component/modal/ApplyModal";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useStoreState } from "../../../store";
import { ImPriceTag } from "react-icons/im";
import { AiOutlineLeft } from "react-icons/ai";
import ViewApplications from "../employer/viewApplications";
import { toast } from "react-hot-toast";
import useProfileCompletionToast from "@/Layout/useProfileCompletionToast";

const JobDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { currentUser, getCategories } = useStoreState();
  const [openApplyModal, setOpenApplyModal] = useState(false);

 
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
    queryKey: ["jobs"],
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
  return (
    <>
      <div className="flex flex-col md:flex-row pt-8 px-8 items-baseline">
        <div className="md:w-3/4 w-full px-8 pb-8 ">
          <div
            className="flex gap-2 items-center text-gray-500 hover:text-black cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            <AiOutlineLeft /> back
          </div>
          <h2 className="text-2xl font-medium mb-4">Job Details</h2>
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
        <div className="flex flex-col justify-center border-l-2 border-gray-300  px-8 py-8 md:w-1/4 md:px-4">
          {currentUser && Object.keys(currentUser).length !== 0 ? (
            !hasApplied ? (
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
                onClick={() => setOpenApplyModal(true)}
              >
                Apply Now
              </button>
            ) : (
              <div className="italic text-center">Applied Successfully</div>
            )
          ) : (
            <div className="italic text-center">Login To Apply</div>
          )}

          <h2 className="text-gray-600 font-bold text-lg mt-8 mb-4">
            Job Categories
          </h2>
          <ul className="list-none">
            {randomCategories.map((category) => (
              <Link
                href={`/job/category/${category.name}`}
                key={category.id}
                className="flex items-center justify-between cursor-pointer
                rounded-md px-4 py-2 hover:bg-gray-50"
              >
                <li>
                  <div>{category.name}</div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      {openApplyModal && (
        <ApplyModal onClose={() => setOpenApplyModal(false)} job={job} />
      )}
    </>
  );
};

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
