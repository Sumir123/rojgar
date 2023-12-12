import Link from "next/link";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useStoreState } from "../../../store";
import AuthLayout from "@/Layout/AuthLayout";
import { useQuery } from "react-query";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  category: Yup.string().required("Required"),
  phone: Yup.string()
    .required("Required")
    .matches(/^98\d{8}$/, "Phone must be 10 characters and start with 98"),
});

const SignUpForm = () => {
  const router = useRouter();
  const { registerUser } = useStoreState();
  const [userType, setUserType] = useState("");

  const toggleUserType = () => {
    setUserType((prevType) =>
      prevType === "jobseeker" ? "employer" : "jobseeker"
    );
  };

  const handleRegisterSubmit = async (data) => {
    try {
      const res = await registerUser(data);

      if (res.message) {
        toast.success(res.message);
        router.push("/account/login");
      }
    } catch (error) {
      console.log("handleRegisterSubmit", error);
      if (error.response.status === 400) {
        toast.error(error?.response?.data?.detail);
      }
    }
  };

  const { getCategories } = useStoreState();
  const {
    isLoading,
    data: categoryData,
    isError,
    error,
  } = useQuery("categories", () => {
    return getCategories();
  });

  return (
    <>
      <div className="py-10 px-4 md:px-12">
        {!userType ? (
          <>
            <div className=" bg-white shadow border-t-2 rounded-xl p-5 md:px-20 md:w-2/5 flex flex-col mx-auto">
              <h1 className="text-xl md:text-3xl font-bold mb-12">
                Join as a jobseeker or employer:
              </h1>
              <div className="flex gap-2 whitespace-nowrap items-center justify-center">
                <button
                  className="px-4 py-3 text-lg font-medium text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                  onClick={() => setUserType("jobseeker")}
                >
                  Job Seeker
                </button>
                <button
                  className="px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-md shadow-md hover:bg-green-600 focus:outline-none"
                  onClick={() => setUserType("employer")}
                >
                  Employer
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute md:fixed text-sm right-5 top-16">
              {userType == "jobseeker"
                ? "Join as employer? "
                : "Join as job seeker? "}

              <button
                onClick={() => toggleUserType()}
                className="text-[#4197E1] "
                href="/signup"
              >
                {userType == "jobseeker" ? " employer" : " job seeker"}
              </button>
            </div>
            <div className="border-gray-400 border-opacity-60 border rounded-xl py-10 px-10 md:px-20 md:w-2/5 flex flex-col mx-auto">
              <h1 className="text-2xl font-bold mb-4">
                {userType === "jobseeker"
                  ? "Sign up to find work you love"
                  : "Sign up to hire talent"}
              </h1>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  name: "",
                  category: "",
                  phone: "",
                  email: "",
                  password: "",
                  role: userType,
                }}
                validationSchema={SignupSchema}
                onSubmit={handleRegisterSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <label htmlFor="name">Full Name</label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        placeholder={
                          userType === "jobseeker"
                            ? "Full Name"
                            : "Organization Name"
                        }
                        className="border border-opacity-60 outline-none border-slate-700 rounded-md px-5 py-1 focus:border-slate-900 hover:border-slate-800"
                      />
                      <div className="text-red-600">
                        <ErrorMessage name="name" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="email">Email</label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder={
                          userType === "jobseeker" ? "Email" : "Official Email"
                        }
                        className="border border-opacity-60 border-slate-700 rounded-md px-5 py-1 focus:border-slate-900 hover:border-slate-800"
                      />
                      <div className="text-red-600">
                        <ErrorMessage name="email" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="password">Password</label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        className="border border-opacity-60  border-slate-700 rounded-md px-5 py-1 focus:border-slate-900 hover:border-slate-800"
                      />
                      <div className="text-red-600">
                        <ErrorMessage name="password" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      {userType === "jobseeker" ? (
                        <label htmlFor="category">Category</label>
                      ) : (
                        <label htmlFor="category">
                          Organization Industry Type
                        </label>
                      )}

                      <Field
                        as="select"
                        name="category"
                        id="category"
                        className="border border-opacity-60 outline-none border-slate-700 rounded-md px-5 py-1 focus:border-slate-900 hover:border-slate-800 "
                      >
                        {userType === "jobseeker" ? (
                          <option value="">Select a category</option>
                        ) : (
                          <option value="">
                            Select Organization Industry Type
                          </option>
                        )}

                        {categoryData?.map((category) => (
                          <option key={category?._id} value={category?.name}>
                            {category?.name}
                          </option>
                        ))}
                      </Field>
                      <div className="text-red-600">
                        <ErrorMessage name="category" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="phone">Phone</label>
                      <Field
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Phone"
                        className="border border-opacity-60 outline-none border-slate-700 rounded-md px-5 py-1 focus:border-slate-900 hover:border-slate-800"
                      />
                      <div className="text-red-600">
                        <ErrorMessage name="phone" />
                      </div>
                    </div>

                    <button
                      className="w-full bg-blue-500 text-white hover:text-white hover:bg-blue-600 rounded-2xl py-1 text-lg cursor-pointer"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submiting..." : "Create my account"}
                    </button>
                  </Form>
                )}
              </Formik>
              <div className="mt-4 mx-auto text-center">
                Already have an account?{" "}
                <Link href="/account/login" className="text-blue-500">
                  Log In
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

SignUpForm.Layout = AuthLayout;
export default SignUpForm;
