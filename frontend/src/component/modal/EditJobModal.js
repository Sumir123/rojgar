import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useQueryClient, useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import { axiosAPI } from "../../../util/axiosAPI";
import { useStoreState } from "../../../store";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  skills: Yup.string().required("Skill is required"),
  price: Yup.number().required("Price is required"),
  payment_type: Yup.string().required("Payment type is required"),
  category: Yup.string().required("Category is required"),
});
const EditJobModal = ({ onClose, job, id }) => {
  const { currentUser, getCategories } = useStoreState();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoading, data, isError, error } = useQuery("categories", () => {
    return getCategories();
  });

  const initialValues = {
    employer_id: job.employer_id,
    title: job.title,
    description: job.description,
    skills: job?.skills?.join(","),
    price: job.price,
    payment_type: job.payment_type,
    category: job.category,
  };

  const mutation = useMutation(
    (data) => {
      const path = "/api/jobs/" + job._id;
      const method = "PUT";
      return axiosAPI(method, path, {}, {}, data);
    },
    {
      onSuccess: (response) => {
        toast.success(response.message);
        queryClient.invalidateQueries("job", id);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error.message);
      },
    }
  );

  const handleSubmit = (values, { resetForm }) => {
    const skillsArray = values.skills.split(",").map((skill) => skill.trim());

    const updatedValues = {
      ...values,
      skills: skillsArray,
      employer_id: currentUser._id,
    };
    mutation.mutate(updatedValues);
    onClose();
    resetForm();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-700 opacity-60"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 w-3/4 h-full overflow-auto mx-auto px-5 py-10 bg-white shadow-md z-20">
        <div
          className="cursor-pointer absolute right-1 top-1"
          onClick={onClose}
        >
          <AiOutlineClose className="ml-auto" size={20} />
        </div>
        <h1 className="font-medium text-lg text-center">Edit Job</h1>
        <div>
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
                Edit
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditJobModal;
