import { postUserProfile } from "@/api";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { toast } from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation, useQueryClient } from "react-query";

const EditProfileModal = ({ onClose, initVal }) => {
  const initialValues = {
    title: initVal?.title || "",
    skills: Array.isArray(initVal?.skills)
      ? initVal?.skills.join(",") // Convert array to string
      : initVal?.skills || "",
    education: Array.isArray(initVal?.education)
      ? initVal?.education.join(",") // Convert array to string
      : initVal?.education || "",
    experiences: Array.isArray(initVal?.experiences)
      ? initVal?.experiences.join(",") // Convert array to string
      : initVal?.experiences || "",
    bio: initVal?.bio || "",
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (updatedValues) => postUserProfile(updatedValues),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries("UserProfile");
        toast.success(res?.message);
        onClose();
      },
      onError: (error) => {
        toast.error(error?.response.data.detail);
      },
    }
  );

  const handleSubmit = async (values) => {
    const skillsArray = values?.skills?.split(",").map((skill) => skill.trim());
    const educationArray = values?.education
      ?.split(",")
      .map((edu) => edu.trim());
    const experienceArray = values?.experiences
      ?.split(",")
      .map((exp) => exp.trim());

    const updatedValues = {
      ...values,
      skills: skillsArray,
      education: educationArray,
      experiences: experienceArray,
    };

    try {
      await mutation.mutateAsync(updatedValues);
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-700 opacity-30 z-10"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 w-3/4 h-max my-auto mx-auto px-5 py-10 bg-white shadow-md z-10 ">
        <div
          className="cursor-pointer absolute right-1 top-1 "
          onClick={onClose}
        >
          <AiOutlineClose className="ml-auto" size={20} />
        </div>
        <h1 className="font-medium text-lg text-center">Edit Profile</h1>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>
            <div>
              <label className="text-lg font-semibold" htmlFor="title">
                Title:
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder="eg:- Software Engineer"
                className="border border-gray-300 rounded-md px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="text-lg font-semibold" htmlFor="bio">
                Bio:
              </label>
              <Field
                as="textarea"
                id="bio"
                name="bio"
                placeholder="eg:- I'm Joe, a seasoned software engineer with expertise in [mention specific areas]. I'm passionate about creating innovative solutions and have [X] years of experience in developing high-quality software."
                className="border border-gray-300 rounded-md px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="text-lg font-semibold" htmlFor="skills">
                Skills:
              </label>
              <Field
                type="text"
                id="skills"
                name="skills"
                placeholder="eg:- Python,JavaScript...."
                className="border border-gray-300 rounded-md px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                required  
              />
            </div>

            <div>
              <label className="text-lg font-semibold" htmlFor="education">
                Education:
              </label>
              <Field
                type="text"
                id="education"
                name="education"
                placeholder="eg:- BCA - College Name , +2 - College Name ,Schooling - School Name"
                className="border border-gray-300 rounded-md px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            <div>
              <label className="text-lg font-semibold" htmlFor="experiences">
                experiences:
              </label>
              <Field
                type="text"
                id="experiences"
                name="experiences"
                placeholder="eg:- Company (job) - 5yrs "
                className="border border-gray-300 rounded-md px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            <button
              type="submit"
              className="mt-2 px-4 py-2 text-white bg-blue-400 rounded-md hover:bg-blue-500"
            >
              Save
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default EditProfileModal;
