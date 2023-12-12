import AdminLayout from "@/Layout/AdminLayout";
import { useQuery } from "react-query";
import { useStoreState } from "../../../store";
import { useState } from "react";
import RenderPaginationButtons from "@/component/pagination/RenderPaginationButtons";

const Posts = () => {
  const { getJobs } = useStoreState();
  const [page, setPage] = useState(1);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => {
      return getJobs(page);
    },
  });
  const totalPage = data?.total_pages;
  const currentPage = data?.current_page;

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="px-4">
      <h1 className="font-semibold text-2xl">Posts</h1>
      <div className="text-right">
        <button className="px-4 py-1 rounded-md text-white bg-blue-400 hover:underline mb-4">
          Add Post
        </button>
      </div>
      <div className="overflow-x-auto max-w-full w-full">
        {isLoading ? (
          <h2>Loading...</h2>
        ) : isError ? (
          <h1> {error.message}</h1>
        ) : (
          <>
            <table className="border-collapse text-sm mb-10 text-left w-full ">
              <thead className="bg-slate-600 text-base  text-gray-300">
                <tr className="">
                  <th className="text-sm font-medium">S.N</th>
                  {/* <th>jobs ID</th>

                  <th>Employer ID</th> */}
                  <th className="text-sm font-medium">Title</th>
                  <th className="text-sm font-medium">Description</th>
                  <th className="text-sm font-medium">Skills</th>
                  <th className="text-sm font-medium">Price</th>
                  <th className="text-sm font-medium">PaymentType</th>
                  <th className="text-sm font-medium">Category</th>
                  {/* <th className="text-sm font-medium">Action</th> */}
                </tr>
              </thead>
              <tbody className="text-xs">
                {data?.jobs?.map((jobs, index) => (
                  <tr
                    key={jobs._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td>{(page - 1) * 10 + index + 1}</td>
                    {/* <td>{jobs._id}</td>
                    <td>{jobs.employer_id}</td> */}
                    <td>{jobs.title}</td>
                    <td>{jobs.description}</td>
                    <td>{jobs.skills}</td>
                    <td>{jobs.price}</td>
                    <td>{jobs["payment_type"]}</td>
                    <td>{jobs.category}</td>
                    {/* <td className="flex gap-2">
                      <button className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button className="text-blue-500 hover:underline">
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination py-10  ">
              <div className="flex justify-center gap-4">
                <div
                  className="prev-btn cursor-pointer"
                  onClick={handlePrevPage}
                >
                  {"<<"}
                </div>
                <RenderPaginationButtons
                  totalPage={totalPage}
                  currentPage={currentPage}
                  page={page}
                  setPage={setPage}
                />

                <div
                  className="prev-btn cursor-pointer"
                  onClick={handleNextPage}
                >
                  {">>"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Posts.Layout = AdminLayout;
export default Posts;
