import React from "react";
import { AiFillTag, AiOutlineClockCircle, AiOutlineBook } from "react-icons/ai";
import { FaBriefcase, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

const TalentCard = ({
  title,
  company,
  location,
  type,
  date,
  description,
  category,
  experience,
  education,
  skills,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <FaBriefcase className="inline-block mr-1 text-gray-400" />
            {company}
          </p>
          <p className="text-sm text-gray-500">
            <FaMapMarkerAlt className="inline-block mr-1 text-gray-400" />
            {location}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            <IoMdTime className="inline-block mr-1 text-gray-400" />
            {date}
          </p>
          <p className="text-sm text-gray-500 text-end">{type}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
              <AiFillTag className="mr-1" /> {category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
              <AiOutlineClockCircle className="mr-1" /> {experience}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
              <AiOutlineBook className="mr-1" /> {education}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          <strong>Skills:</strong>
        </p>
        <ul className="mt-2 ml-4">
          {skills.map((skill) => (
            <li
              key={skill}
              className="text-xs text-gray-600 bg-gray-200 rounded-full px-2 py-1 inline-block mr-2 mb-2"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TalentCard;
