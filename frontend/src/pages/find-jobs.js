import JobCard from "@/component/JobCard";
import { jobsData } from "@/data/jobsData";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useStoreState } from "../../store";

const FindJobsSection = () => {
  const [page, setPage] = useState(1);
  const { getJobs } = useStoreState();
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => {
      return getJobs(page);
    },
  });


  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold  text-gray-900">Find Jobs</h2>
        <div className="mt-6">
          {data?.jobs?.map((job) => {
            return (
              <JobCard
                key={job._id}
                id={job._id}
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                date={job.date}
                description={job.description}
                category={job.category}
                skills={job.skills}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FindJobsSection;
