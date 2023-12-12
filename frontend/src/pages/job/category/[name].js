import { getJobs, getJobsByOptions } from "@/api";
import Card from "@/component/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";

const CategoryJobs = () => {
  const router = useRouter();
  const { name } = router.query;
  const [page, setPage] = useState(1);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["jobs", name, page],
    queryFn: () => {
      return getJobs({ category: name, page: page });
    },
  });

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };
  return (
    <div className="pt-8 px-12">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        <Link className="text-blue-600" href="/job/category">
          Category
        </Link>
        /{name}
      </h1>
      <Card
        isLoading={isLoading}
        data={data}
        page={page}
        setPage={setPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};

export default CategoryJobs;
