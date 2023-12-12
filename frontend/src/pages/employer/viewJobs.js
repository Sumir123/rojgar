import EmployerLayout from "@/Layout/EmployerLayout";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { useStoreState } from "../../../store";
import { axiosAPI } from "../../../util/axiosAPI";
import Card from "@/component/Card";
import Link from "next/link";

const viewJobs = () => {
  const { currentUser } = useStoreState();
  const [page, setPage] = useState(1);

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const getEmployerJobs = (page) => {
    const path = "/api/jobs";
    const method = "GET";
    const params = { employer_id: currentUser?._id, page: page };
    return axiosAPI(method, path, {}, params);
  };

  useEffect(() => {
    setPage(1);
  }, [currentUser]);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => {
      return getEmployerJobs(page);
    },
    enabled: !!currentUser?._id,
    retry: 1,
  });

  return (
    <>
      <div className="flex px-4 flex-col ">
        <div>
          <h1 className="font-semibold text-xl mb-4">My Jobs</h1>
        </div>
        <div className="overflow-x-auto max-w-full w-full">
          {isLoading ? (
            <h2>Loading...</h2>
          ) : (
            <>
              <Card
                data={data}
                page={page}
                setPage={setPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
              />
              {isError && (
                <div className="flex flex-col justify-center items-center gap-2">
                  <p>No jobs Posted.</p>
                  <Link
                    href="/employer/postJobs"
                    className="text-blue-500 hover:underline"
                  >
                    Click here to post your first job
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

viewJobs.Layout = EmployerLayout;

export default viewJobs;
