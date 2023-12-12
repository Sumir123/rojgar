import { ApplyForJobs } from "@/api";
import { ErrorMessage, Formik } from "formik";
import { toast } from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import { useStoreState } from "../../../store";

const validationSchema = Yup.object({
  resume: Yup.mixed().required("resume  is required"),
  cover_letter: Yup.mixed().required("Cover letter is required"),
});

const ApplyModal = ({ onClose, job }) => {
  const { currentUser } = useStoreState();

  const initialValues = {
    resume: null,
    cover_letter: null,
  };
  var usersData = {
    user_id: currentUser._id,
    job_id: job._id,
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => {
      return ApplyForJobs(data, usersData);
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      queryClient.invalidateQueries("MyApplication");
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.detail ||
          "An error occurred while submitting the application."
      );
    },
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("resume", values.resume);
    formData.append("cover_letter", values.cover_letter);

    mutation.mutate(formData);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-700 opacity-30"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 w-3/4 h-max my-auto mx-auto px-5 py-10 bg-white shadow-md z-20">
        <div
          className="cursor-pointer absolute right-1 top-1"
          onClick={onClose}
        >
          <AiOutlineClose className="ml-auto" size={20} />
        </div>
        <h1 className="font-medium text-lg text-center">
          Submit a Application
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="my-4">
                <label htmlFor="resume">Resume: </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={(event) =>
                    formik.setFieldValue("resume", event.target.files[0])
                  }
                  className="border border-gray-300 p-2 mt-1 w-full rounded-lg"
                />

                <ErrorMessage
                  name="resume"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="my-4">
                <label htmlFor="cover_letter">Cover Letter</label>
                <input
                  type="file"
                  id="cover_letter"
                  name="cover_letter"
                  onChange={(event) =>
                    formik.setFieldValue("cover_letter", event.target.files[0])
                  }
                  className="border border-gray-300 p-2 mt-1 w-full  rounded-lg"
                />
                <ErrorMessage
                  name="cover_letter"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                disabled={!formik.isValid}
              >
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ApplyModal;
