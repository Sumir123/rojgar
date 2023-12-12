import MainLayout from "@/Layout/MainLayout";
import useProfileCompletionToast from "@/Layout/useProfileCompletionToast";
import { getJobs, getUserProfile } from "@/api";
import Card from "@/component/Card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiSearch } from "react-icons/bi";
import { useQuery } from "react-query";

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("latest");

  useProfileCompletionToast();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["jobs", page, searchQuery, selectedOrder],
    queryFn: () => {
      if (searchQuery.length < 3) {
        return getJobs({ page, order: selectedOrder });
      } else {
        return getJobs({
          page,
          search_terms: searchQuery,
          order: selectedOrder,
        });
      }
    },
  });

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleSearch = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
    if (newSearchQuery.length < 3) {
      setSelectedOrder("latest");
    }
  };

  const handleOrderChange = (e) => {
    const newOrder = e.target.value;
    setSelectedOrder(newOrder);
  };

  useEffect(() => {
    if (searchQuery.length > 3) {
      setPage(1); // Reset page when search query changes
    }
  }, [searchQuery]);

  return (
    <>
      <div className="flex flex-col md:flex-row my-8">
        {/* <div className="md:w-1/4 px-4">
          <Sidebar />
        </div> */}
        <div className="flex-1 px-12 mt-8 md:mt-0">
          <div className="flex gap-10 items-center justify-between mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                className="pl-4 pr-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
              <BiSearch className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={selectedOrder}
              onChange={handleOrderChange}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error: {error.message}</p>
          ) : data && data.jobs?.length > 0 ? (
            <Card
              isLoading={isLoading}
              data={data}
              page={page}
              setPage={setPage}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </>
  );
};

Dashboard.setLayout = MainLayout;
export default Dashboard;
