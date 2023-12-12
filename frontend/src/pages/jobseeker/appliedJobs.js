import { getApplication, getJobs } from "@/api";
import { useQuery } from "react-query";
import { useStoreState } from "../../../store";
import Link from "next/link";
import useProfileCompletionToast from "@/Layout/useProfileCompletionToast";

const AppliedJobs = () => {
  const { currentUser } = useStoreState();
  useProfileCompletionToast();
  const applicationData = useQuery({
    queryKey: ["MyApplication"],
    queryFn: getApplication,
    enabled: !!currentUser?._id,
  });

  const applications = applicationData?.data;
  const jobIds = applications?.map((application) => application.job_id);

  const jobsData = useQuery({
    queryKey: ["MyJobs", { id: jobIds }],
    queryFn: () => getJobs({ id: jobIds }),
    enabled: !!jobIds && jobIds.length > 0,
  });

  const jobs = jobsData?.data?.jobs;

  return (
    <div className="pt-8 px-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Applied Jobs</h1>
      {applications && applications.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="text-left">
              <th className="py-3 px-6 bg-gray-100 font-bold uppercase text-sm text-gray-600 border-b border-gray-200">
                Job Title
              </th>
              <th className="py-3 px-6 bg-gray-100 font-bold uppercase text-sm text-gray-600 border-b border-gray-200">
                Resume
              </th>
              <th className="py-3 px-6 bg-gray-100 font-bold uppercase text-sm text-gray-600 border-b border-gray-200">
                Cover Letter
              </th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((application) => {
              const job = jobs?.find((job) => job._id === application.job_id);

              return (
                <tr key={application._id}>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <Link
                      className="text-blue-900 hover:underline"
                      href={`/job/${job?._id}`}
                    >
                      {job?.title}
                    </Link>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <Link
                      className="text-blue-500"
                      href={`http://localhost:4000/api/application/resume/${application._id}`}
                      target="_blank"
                    >
                      {application.resume_filename}
                    </Link>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <Link
                      className="text-blue-500"
                      href={`http://localhost:4000/api/application/cover_letter/${application._id}`}
                      target="_blank"
                    >
                      {application.cover_letter_filename}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No applied jobs found.</p>
      )}
    </div>
  );
};

export default AppliedJobs;
