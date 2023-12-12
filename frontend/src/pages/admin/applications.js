import AdminLayout from "@/Layout/AdminLayout";
import { useQuery } from "react-query";
import { useStoreState } from "../../../store";

const origin = process.env.NEXT_PUBLIC_API_URL;

const Applications = () => {
  const { getApplications } = useStoreState();

  const { isLoading, data, isError, error } = useQuery("applications", () => {
    return getApplications();
  });

  return (
    <>
      <div className="px-4">
        <h1 className="font-semibold text-2xl">Applications</h1>
        <div className="text-right">
          <button className="px-4 py-1 rounded-md text-white bg-blue-400 hover:underline mb-4">
            Add Application
          </button>
        </div>
        <div>
          {isLoading ? (
            <h2>Loading...</h2>
          ) : isError ? (
            <h1> {error.message}</h1>
          ) : (
            <table className="border-collapse text-left w-full">
              <thead className="bg-slate-600 text-gray-300">
                <tr>
                  <th>S.N</th>
                  <th>User ID</th>
                  <th>Job ID</th>
                  <th>Resume Filename</th>
                  <th>Cover Letter Filename</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {data.applications.map((application, index) => (
                  <tr
                    key={application._id}
                    className="border-b border-gray-100 hover:bg-gray-100"
                  >
                    <td>{index + 1}</td>
                    <td>{application.user_id}</td>
                    <td>{application.job_id}</td>
                    <td>
                      <a
                        className="text-blue-600 hover:underline"
                        href={
                          origin + "/api/application/resume/" + application._id
                        }
                        target="_blank"
                      >
                        {application.resume_filename.replace("uploads\\", "")}
                      </a>
                    </td>
                    <td>
                      <a
                        className="text-blue-600 hover:underline"
                        href={
                          origin +
                          "/api/application/cover_letter/" +
                          application._id
                        }
                        target="_blank"
                      >
                        {application.cover_letter_filename}
                      </a>
                    </td>
                    {/* <td className="flex gap-2">
                      <button className="text-blue-500 hover:underline">
                        edit
                      </button>
                      <button className="text-blue-500 hover:underline">
                        delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

Applications.Layout = AdminLayout;
export default Applications;
