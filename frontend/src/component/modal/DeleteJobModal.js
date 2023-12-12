import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation, useQueryClient } from "react-query";
import { axiosAPI } from "../../../util/axiosAPI";

const DeleteJobModal = ({ onClose, job, id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteJob = async () => {
    return await axiosAPI("DELETE", `/api/jobs/${id}`);
  };

  const { mutate } = useMutation(deleteJob, {
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries("job", 1);
      router.push("/employer/viewJobs");
    },
  });
  return (
    <>
      <div
        className="fixed inset-0 bg-gray-700 opacity-60"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 overflow-auto h-max mx-auto my-auto px-5 py-5 bg-white shadow-md z-20">
        <div
          className="cursor-pointer absolute right-1 top-1"
          onClick={onClose}
        >
          <AiOutlineClose className="ml-auto" size={20} />
        </div>
        <h1 className="text-xl font-medium mb-4 text-center">Edit Job</h1>
        <p className="text-gray-600 text-center mb-4">
          Are you sure you want to delete this job?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-gray-500 text-white font-semibold py-1 px-4 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white font-semibold py-1 px-4 rounded hover:bg-red-600"
            onClick={mutate}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteJobModal;
