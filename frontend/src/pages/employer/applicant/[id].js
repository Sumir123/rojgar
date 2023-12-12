import EmployerLayout from "@/Layout/EmployerLayout";
import { getUserDetails } from "@/api";
import { useRouter } from "next/router";
import { AiOutlineLeft } from "react-icons/ai";
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { useQuery } from "react-query";

const ApplicantDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading, isError, data, error } = useQuery(
    ["userDetails", id],
    () => getUserDetails(id),
    {
      enabled: !!id,
    }
  );

  return (
    <>
      <div
        className="flex px-10 gap-2 items-center text-gray-500 hover:text-black cursor-pointer"
        onClick={() => {
          router.back();
        }}
      >
        <AiOutlineLeft /> back
      </div>
      <div className="mx-auto md:flex px-8 justify-between pb-10">
        <div className=" bg-white rounded-md shadow-sm border p-2 m-4">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Profile Picture"
              className="object-cover w-full -z-10 h-full"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">{data?.name}</h2>
            <p className="text-gray-600 mb-4">{data?.category}</p>
          </div>

          <div className="p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Skills</h3>
            <ul className="list-disc list-inside">
              {data?.profile?.skills.map((skill) => (
                <li key={skill} className="text-gray-600">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 mt-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Contact Information</h3>
            <p className="text-gray-600 mb-2">{data?.email}</p>
            <p className="text-gray-600">{data?.phone}</p>
          </div>
        </div>
        <div className="md:flex-1 mt-4 ">
          <div className="mb-4 bg-white p-2 shadow-sm border">
            <h2 className="text-xl text-primary font-medium mb-2">
              Basic Information
            </h2>
            <div>
              <p className="text-gray-600 mb-4">Name: {data?.name}</p>
              <p className="text-gray-600 mb-4">Category: {data?.category}</p>
              <p className="text-gray-600 mb-4">Phone: {data?.phone}</p>
              <p className="text-gray-600 mb-4">Email: {data?.email}</p>
              <p className="text-gray-600 mb-4">Role: {data?.role}</p>
            </div>
          </div>

          <div className="mb-4 bg-white shadow-sm border p-2">
            <h2 className="text-xl font-medium text-primary mb-2">
              {data?.profile?.title || "Job Title"}
            </h2>
            <p className="text-gray-600 mb-4">{data?.profile?.bio}</p>
          </div>
          {data?.experiences &&
            data.experiences.some((exp) => exp.trim() !== "") && (
              <div className="mb-4 bg-white shadow-sm border p-2">
                <h2 className="text-xl font-medium  text-primary  mb-4">
                  Experience
                </h2>
                <div className="mb-8 bg-white p-2 shadow-md">
                  <h2 className="text-xl font-medium text-primary mb-4">
                    Experience
                  </h2>
                  {data.experiences.map((experience) => (
                    <div key={experience} className="flex items-center mb-2">
                      <FaBriefcase className="w-4 h-4 text-gray-500 mr-2" />
                      <p className="text-gray-600">{experience}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          <div className="bg-white shadow-sm border p-2">
            <h2 className="text-xl font-medium  text-primary  mb-4">
              Education
            </h2>
            {data?.profile?.education.map((education) => (
              <div key={education} className="flex items-center mb-2">
                <FaGraduationCap className="w-4 h-4 text-gray-500 mr-2" />
                <p className="text-gray-600">{education}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

ApplicantDetails.Layout = EmployerLayout;
export default ApplicantDetails;
