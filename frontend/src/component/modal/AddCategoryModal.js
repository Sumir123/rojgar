import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { axiosAPI } from "../../../util/axiosAPI";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required"),
});

const AddCategoryModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => {
      const path = "/api/categories";
      const method = "POST";
      return axiosAPI(method, path, {}, {}, data);
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

  const handleSubmit = (values, { resetForm }) => {
    mutation.mutate(values);
    resetForm();
    onClose();
  };

  return (
    <>
      <div
        className={`${
          isOpen ? "fixed" : "hidden"
        }  inset-0 opacity-30 bg-slate-500`}
        onClick={onClose}
      ></div>
      <div
        className={`${
          isOpen
            ? "fixed inset-0 shadow-md bg-white mx-auto my-auto w-1/2  max-h-max  p-4"
            : "hidden"
        }`}
      >
        <div
          className="cursor-pointer absolute right-1 top-1 "
          onClick={onClose}
        >
          <AiOutlineClose className="ml-auto" size={20} />
        </div>
        <div className="pb-4">
          <Formik
            initialValues={{ name: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <Form className="flex justify-between flex-col ">
              <div className="mb-2">
                <label htmlFor="name" className="text-lg font-semibold">
                  Category Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="border border-gray-300 rounded-md px-3 py-1 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Enter category name"
                  required
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 mr-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-400 rounded-md hover:bg-blue-500"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? "Adding..." : "Add Category"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;
