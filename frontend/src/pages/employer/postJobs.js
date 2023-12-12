import EmployerLayout from "@/Layout/EmployerLayout";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, queryClient } from "react-query";
import * as Yup from "yup";
import { useStoreState } from "../../../store";
import { axiosAPI } from "../../../util/axiosAPI";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  skills: Yup.string().required("Skill is required"),
  price: Yup.number().required("Price is required"),
  payment_type: Yup.string().required("Payment type is required"),
  category: Yup.string().required("Category is required"),
});

const postJobs = () => {
  const { currentUser, getCategories } = useStoreState();
  const router = useRouter();

  const { isLoading, data, isError, error } = useQuery("categories", () => {
    return getCategories();
  });

  const initialValues = {
    employer_id: "",
    title: "",
    description: "",
    skills: "",
    price: "",
    payment_type: "",
    category: "",
  };

  const mutation = useMutation(
    (data) => {
      const path = "/api/jobs";
      const method = "POST";
      return axiosAPI(method, path, {}, {}, data);
    },
    {
      onSuccess: (response) => {
        toast.success(response.message);
      },
      onError: (error) => {
        toast.error(error.message);

        console.log(error.message);
      },
    }
  );

  const handleSubmit = async (values, { resetForm }) => {
    const skillsArray = values.skills.split(",").map((skill) => skill.trim());

    const updatedValues = {
      ...values,
      skills: skillsArray,
      employer_id: currentUser._id,
    };
    mutation.mutate(updatedValues);
    resetForm();
    await queryClient.refetchQueries(["jobs", page]);
    router.push("/employer/viewJobs");
  };

  return (
    <>
      <div className="px-4">
        <h1 className="font-semibold text-xl mb-4">Post Job</h1>
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <div className=" lg:w-[60%] flex-1 mb-10 p-4 border ">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="mb-4">
                  <label htmlFor="title" className="">
                    Title
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="eg:- Software engineer"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    rows="5"
                    name="description"
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="eg:- 
                    Job Description:
                    We are seeking a talented and experienced Software Engineer to join our team. As a Software Engineer, you will be responsible for designing, developing, and maintaining software applications that meet our clients needs.
                    
                    Responsibilities:
                    - 
                    -
                    -
                    
                    Requirements:
                    -
                    -
                    `
                  "
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="skills" className="">
                    Skills reuired
                    <span className="text-[10px] text-">
                      {"  "} use comma (,) to seperate multiple skills
                    </span>
                  </label>
                  <Field
                    type="text"
                    id="skills"
                    name="skills"
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="eg:- C++,JAVA,JavaScript,Python"
                  />
                  <ErrorMessage
                    name="skills"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="price" className="">
                    Payment
                  </label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="eg:- 120000"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="payment_type" className="">
                    Payment Type
                  </label>
                  <Field
                    as="select"
                    id="payment_type"
                    name="payment_type"
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="">Select Payment Type</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Monthly">Monthly</option>
                  </Field>
                  <ErrorMessage
                    name="payment_type"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="">
                    Category
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="">Select Category</option>
                    {data?.map((category, index) => (
                      <option value={category.name} key={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  Post
                </button>
              </Form>
            </Formik>
          </div>
          <div className="w-[15%] overflow-hidden  ">
            <img src="/illustration.avif" className="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </>
  );
};

postJobs.Layout = EmployerLayout;
export default postJobs;
