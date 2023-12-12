import EmployerLayout from "@/Layout/EmployerLayout";
import React from "react";
import { useStoreState } from "../../../store";
import { axiosAPI } from "../../../util/axiosAPI";
import { useQuery } from "react-query";
import { FaUser } from "react-icons/fa";
import { getMyApplication } from "@/api";
import ApplicationCard from "@/component/ApplicationCard";

const ViewApplications = () => {
  const myApplications = useQuery("myApplications", getMyApplication);

  if (myApplications.isLoading) {
    return (
      <div className="flex px-4 flex-col">
        <div>
          <h1 className="font-semibold text-xl mb-4">View Applications</h1>
        </div>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex px-4 flex-col">
        <div>
          <h1 className="font-semibold text-xl mb-4">View Applications</h1>
        </div>

        <div>
          <ApplicationCard
            applications={myApplications?.data?.applications || []}
          />
        </div>
        {Object.values(myApplications?.data?.applications || []).length ===
          0 && <p>Sorry no-one has applied at the moment.</p>}

        {/* <div>
            {applicants?.data?.users?.map((applicant) => (
              <li key={applicant?._id} className="py-4 flex items-center">
                <div className="flex-shrink-0">
                  <FaUser size={32} className="text-gray-500" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    {applicant?.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Category:</span>{" "}
                    {applicant?.category}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Email:</span>{" "}
                    {applicant?.email}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Phone:</span>{" "}
                    {applicant?.phone}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Role:</span> {applicant?.role}
                  </p>
                </div>
              </li>
            ))}
          </div> */}
        {/* <div className="flex-1">
            {usersApplications?.data?.applications.map((application) => (
              <div className="flex">
                <h1>job id: {application?.job_id}</h1>
                <p>resume_filename: {application?.resume_filename}</p>
                <p>
                  cover_letter_filename: {application?.cover_letter_filename}
                </p>
              </div>
            ))}
          </div> */}
      </div>
    </>
  );
};

ViewApplications.Layout = EmployerLayout;
export default ViewApplications;
