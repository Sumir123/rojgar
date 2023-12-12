import AdminLayout from "@/Layout/AdminLayout";
import {
  FaAddressBook,
  FaBriefcase,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { useStoreState } from "../../../store";
import { useQuery } from "react-query";

const StatsCard = ({ icon, label, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-t-2">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-lg font-bold text-gray-700">{value}</p>
        </div>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const { getAllUser, getCategories, getApplications, getJobs } =
    useStoreState();

  const userQuery = useQuery("users", getAllUser);
  const categoriesQuery = useQuery("categories", getCategories);
  const applicationsQuery = useQuery("applications", getApplications);
  const jobsQuery = useQuery("jobs", () => getJobs(1));

  const isLoading =
    userQuery.isLoading ||
    categoriesQuery.isLoading ||
    applicationsQuery.isLoading ||
    jobsQuery.isLoading;
  const isError =
    userQuery.isError ||
    categoriesQuery.isError ||
    applicationsQuery.isError ||
    jobsQuery.isError;
  const error =
    userQuery.error ||
    categoriesQuery.error ||
    applicationsQuery.error ||
    jobsQuery.error;

  return (
    <>
      <div className="px-4">
        <h1 className="font-semibold text-2xl">Dashboard</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={<FaUser className="text-gray-500" size={24} />}
            label="Total Users"
            value={userQuery?.data?.length || 0}
          />
          <StatsCard
            icon={<FaBriefcase className="text-gray-500" size={24} />}
            label="Total Jobs"
            value={jobsQuery?.data?.total_jobs || 0}
          />
          <StatsCard
            icon={<FaUserFriends className="text-gray-500" size={24} />}
            label="Total Applicants"
            value={applicationsQuery?.data?.total_applications || 0}
          />
          <StatsCard
            icon={<FaAddressBook className="text-gray-500" size={24} />}
            label="Total Categories"
            value={categoriesQuery?.data?.length || 0}
          />
        </div>
      </div>
    </>
  );
};

Dashboard.Layout = AdminLayout;
export default Dashboard;
