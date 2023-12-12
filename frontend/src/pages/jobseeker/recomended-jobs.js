import useProfileCompletionToast from "@/Layout/useProfileCompletionToast";
import { getRecommendedJobs, getUserProfile } from "@/api";
import Card from "@/component/Card";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";

const recomended = () => {
  const [page, setPage] = useState(1);

  useProfileCompletionToast();

  const userProfile = useQuery({
    queryKey: ["UserProfile"],
    queryFn: getUserProfile,
    retry: false,
  });

  const profileData = userProfile?.data;

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["recommendedJobs", page],
    queryFn: () => {
      return getRecommendedJobs({
        user_skills: profileData?.skills.toString(),
        page: page,
      });
    },
    retry: 1,
    enabled: !!profileData?.skills,
  });

  if (isError) {
    toast.error(error?.message);
  }
  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };
 
  return (
    <>
      <div className="mx-auto bg-slate-50 md:flex px-4 md:px-20 md:gap-10 justify-between py-5">
        <div className="flex-1 px-4 mt-8 md:mt-0">
          <h1 className="mb-4 font-bold text-lg ">
            Top Jobs that matches your skills
          </h1>
          {isLoading ? (
            <div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {data?.recommended_jobs.length > 0 ? (
                <Card
                  isLoading={isLoading}
                  data={data}
                  page={page}
                  setPage={setPage}
                  handlePrevPage={handlePrevPage}
                  handleNextPage={handleNextPage}
                />
              ) : (
                <p>No jobs found for your skills.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default recomended;
