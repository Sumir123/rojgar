import AuthLayout from "@/Layout/AuthLayout";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoMdMail } from "react-icons/io";
import { IoLockClosed } from "react-icons/io5";
import * as Yup from "yup";
import { useStoreState } from "../../../store";
import HandleCookies from "../../../util/handleCookie";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [err, seterr] = useState([]);
  const router = useRouter();
  const { setUserTokenData, getCurrentUser, loginUser } = useStoreState();

  const handleLogin = async (data) => {
    const uData = { ...data };

    try {
      uData.username = uData.email;
      delete uData["email"];

      const userData = await loginUser(uData);

      HandleCookies.setCookieJson("token", userData?.access_token);

      if (userData?.access_token) {
        setUserTokenData(userData.access_token);

        const currentuserdata = await getCurrentUser();
        HandleCookies.setCookieJson("userdata", currentuserdata);

        const role = currentuserdata.role;

        if (role === "admin") {
          router.push("/admin/dashboard");
        }
        if (role === "jobseeker") {
          router.push("/jobseeker/dashboard");
        }
        if (role === "employer") {
          router.push("/employer/dashboard");
        }
        toast.success("Logged in successfully");
      }
    } catch (error) {
      console.log("Error while logging in", error);
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data?.detail);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Rojgar-Login</title>
      </Head>
      <div className="py-10 px-4 md:px-12">
        <div className="border-gray-400 border-opacity-60 border rounded-xl  p-5 md:px-20 md:w-2/5 flex flex-col mx-auto">
          <h1 className="text-xl md:text-3xl font-bold mb-12">
            Log in to your account
          </h1>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="border border-opacity-60 border-slate-700 rounded-md px-5 py-1 focus:border-slate-900 hover:border-slate-800 pl-8 w-full"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <IoMdMail />
                    </span>
                  </div>
                  <div className="text-red-600">
                    <ErrorMessage name="email" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="border border-opacity-60 border-slate-700 rounded-md px-5 py-1 focus:border-slate-900 hover:border-slate-800 pl-8 w-full"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <IoLockClosed />
                    </span>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {showPassword ? (
                        <HiEyeOff
                          className="cursor-pointer text-gray-400"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <HiEye
                          className="cursor-pointer text-gray-400"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </span>
                  </div>
                  <div className="text-red-600">
                    <ErrorMessage name="password" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4197E1] text-gray-100 hover:text-white  hover:bg-[#2488e0] rounded-2xl py-1 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
          <div className="text-center mt-12 relative">
            <span className="absolute top-1/2 left-0 w-1/6 h-[1px] bg-gray-400"></span>
            <span className="text-gray-600 hover:text-slate-900 relative z-10 px-4 whitespace-nowrap">
              Don't have an Upwork account?
            </span>
            <span className="absolute top-1/2 right-0 w-1/6 h-[1px] bg-gray-400"></span>
          </div>

          <div className="mx-auto mt-4">
            <Link
              href="/account/signup"
              className="border-[#4197E1] border-2  px-6 py-2 text-[#4197E1] rounded-3xl hover:bg-slate-200"
            >
              Signup for free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

LoginForm.Layout = AuthLayout;
export default LoginForm;
