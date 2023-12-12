import EmployerLayout from "@/Layout/EmployerLayout";
import EditProfileModal from "@/component/modal/EditProfileModal";
import Head from "next/head";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useStoreState } from "../../../store";

const Profile = () => {
  const { currentUser } = useStoreState();

  return (
    <>
      <div className=" px-4 text-lg font-medium">My Profile</div>

      <div className="md:flex  px-4  md:gap-10 justify-between py-5">
        <div className=" bg-white rounded-md shadow border p-4">
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
          <div className="p-4 mt-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Contact Information</h3>
            <p className="text-gray-600 mb-2">{currentUser.email}</p>
            <p className="text-gray-600">{currentUser.phone}</p>
          </div>
        </div>
        <div className="md:flex-1 p-4 border shadow">
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
      </div>
    </>
  );
};

Profile.Layout = EmployerLayout;
export default Profile;
