import AdminLayout from "@/Layout/AdminLayout";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useStoreState } from "../../../store";
import { useState } from "react";
import AddCategoryModal from "@/component/modal/AddCategoryModal";
import { toast } from "react-hot-toast";
import { axiosAPI } from "../../../util/axiosAPI";

const Categories = () => {
  const { getCategories } = useStoreState();
  const { isLoading, data, isError, error } = useQuery("categories", () => {
    return getCategories();
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategoryClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (category_id) => {
      const path = "/api/categories/" + category_id;
      const method = "DELETE";
      return axiosAPI(method, path);
    },
    {
      onSuccess: (response) => {
        toast.success(response.message);
        queryClient.invalidateQueries("categories");
      },
      onError: (error) => {
        toast.error(error.message);

        console.log(error.message);
      },
    }
  );

  const handleDelete = (category_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmed) {
      mutation.mutate(category_id);
    }
  };
  return (
    <>
      <div className="px-4">
        <h1 className="font-semibold text-2xl">Categories</h1>
        <div className="text-right">
          <button
            className="px-4 py-1 rounded-md text-white bg-blue-400 hover:underline mb-4"
            onClick={handleAddCategoryClick}
          >
            Add Category
          </button>
        </div>
        <div>
          {isLoading ? (
            <h2>Loading...</h2>
          ) : isError ? (
            <h1> {error.message}</h1>
          ) : (
            <table className="border-collapse  text-left w-full mb-20">
              <thead className="bg-slate-600 text-gray-300 ">
                <tr>
                  <th>S.N</th>
                  <th>id</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="">
                {data.map((category, index) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-100 hover:bg-gray-100"
                  >
                    <td>{index + 1}</td>
                    <td>{category._id}</td>
                    <td>{category.name}</td>

                    <td className="flex gap-2">
                     
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleDelete(category._id)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddCategoryModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

Categories.Layout = AdminLayout;
export default Categories;
