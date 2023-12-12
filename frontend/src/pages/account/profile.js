import { getUserProfile } from "@/api";
import EditProfileModal from "@/component/modal/EditProfileModal";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaBriefcase, FaEdit, FaGraduationCap } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import { useStoreState } from "../../../store";

const Profile = () => {
  const [openEditModal, setOpenEditModal] = useState(false);

  const toggleEditModal = () => {
    setOpenEditModal(!openEditModal);
  };

  const userProfile = useQuery({
    queryKey: ["UserProfile"],
    queryFn: getUserProfile,
    retry: false,
    staleTime: 5000,
  });

  const { data, status, error, isError } = userProfile;

  useEffect(() => {
    if (isError) {
      setOpenEditModal(true);
    }
  }, [isError]);

  const { currentUser } = useStoreState();

  if (status === "loading") {
    return (
      <div className="mx-auto bg-slate-50 md:flex px-4 -z-10 md:px-20 md:gap-10 justify-between py-5">
        <div className=" bg-white rounded-md shadow-md m-4">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Skeleton circle width={128} height={128} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">
              <Skeleton width={120} />
            </h2>
            <p className="text-gray-600 mb-4">
              <Skeleton width={120} />
            </p>
          </div>
          <div className="flex justify-center mb-4">
            <Skeleton width={120} height={40} />
          </div>
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">
              <Skeleton />
            </h3>
            <ul className="">
              <li className="text-gray-600">
                <Skeleton count={2} />
              </li>
            </ul>
          </div>
          <div className="p-4 mt-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">
              <Skeleton />
            </h3>
            <p className="text-gray-600 mb-2">
              <Skeleton width={200} />
            </p>
            <p className="text-gray-600">
              <Skeleton width={180} />
            </p>
          </div>
        </div>
        <div className="md:flex-1 mt-4 ">
          <div className="mb-8 bg-white p-2 shadow-md">
            <h2 className="text-xl text-primary font-medium mb-2">
              <Skeleton />
            </h2>
            <div>
              <p className="text-gray-600 mb-4">
                <Skeleton count={2} />
              </p>
            </div>
          </div>

          <div className="mb-8 bg-white p-2 shadow-md">
            <h2 className="text-xl font-medium text-primary mb-2">
              <Skeleton />
            </h2>
            <p className="text-gray-600 mb-4">
              <Skeleton count={2} />
            </p>
          </div>
          <div className="mb-8 bg-white p-2 shadow-md">
            <h2 className="text-xl font-medium  text-primary  mb-4">
              <Skeleton />
            </h2>
            <div>
              <Skeleton count={2} />
            </div>
          </div>
          <div className="bg-white p-2 shadow-md">
            <h2 className="text-xl font-medium  text-primary  mb-4">
              <Skeleton />
            </h2>
            <div>
              <Skeleton count={2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto bg-slate-50 md:flex px-4 md:px-20 md:gap-10 justify-between py-5">
        <div className=" bg-white rounded-md shadow-md m-4">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Profile Picture"
              className="object-cover w-full -z-10 h-full"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">{currentUser.name}</h2>
            <p className="text-gray-600 mb-4">{currentUser.category}</p>
          </div>
          <div className="flex justify-center mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md block "
              onClick={toggleEditModal}
            >
              <FaEdit className="inline-block mr-2" />
              Edit Profile
            </button>
          </div>
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Skills</h3>
            <ul className="list-disc list-inside">
              {data?.skills.map((skill) => (
                <li key={skill} className="text-gray-600">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 mt-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Contact Information</h3>
            <p className="text-gray-600 mb-2">{currentUser.email}</p>
            <p className="text-gray-600">{currentUser.phone}</p>
          </div>
        </div>
        <div className="md:flex-1 mt-4 ">
          <div className="mb-8 bg-white p-2 shadow-md">
            <h2 className="text-xl text-primary font-medium mb-2">
              Basic Information
            </h2>
            <div>
              <p className="text-gray-600 mb-4">Name: {currentUser?.name}</p>
              <p className="text-gray-600 mb-4">
                Category: {currentUser?.category}
              </p>
              <p className="text-gray-600 mb-4">Phone: {currentUser?.phone}</p>
              <p className="text-gray-600 mb-4">Email: {currentUser?.email}</p>
              <p className="text-gray-600 mb-4">Role: {currentUser?.role}</p>
            </div>
          </div>

          <div className="mb-8 bg-white p-2 shadow-md">
            <h2 className="text-xl font-medium text-primary mb-2">
              {data?.title || "Job Title"}
            </h2>
            <p className="text-gray-600 mb-4">{data?.bio}</p>
          </div>
          {data?.experiences &&
            data.experiences.some((exp) => exp.trim() !== "") && (
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
            )}

          <div className="bg-white p-2 shadow-md">
            <h2 className="text-xl font-medium  text-primary  mb-4">
              Education
            </h2>
            {data?.education.map((education) => (
              <div key={education} className="flex items-center mb-2">
                <FaGraduationCap className="w-4 h-4 text-gray-500 mr-2" />
                <p className="text-gray-600">{education}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {openEditModal && (
        <EditProfileModal
          onClose={toggleEditModal}
          initVal={userProfile.data}
        />
      )}
    </>
  );
};

export default Profile;
