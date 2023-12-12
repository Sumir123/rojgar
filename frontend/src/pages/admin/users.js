import AdminLayout from "@/Layout/AdminLayout";
import { useQuery } from "react-query";
import { useStoreState } from "../../../store";

const Users = () => {
  const { getAllUser } = useStoreState();

  const { isLoading, data, isError, error } = useQuery("users", () => {
    return getAllUser();
  });

  return (
    <>
      <div className="px-4">
        <h1 className="font-semibold text-2xl">Users</h1>
        <div>
          {isLoading ? (
            <h2>Loading...</h2>
          ) : isError ? (
            <h1> {error.message}</h1>
          ) : (
            <table className="border-collapse text-sm mb-10 text-left w-full ">
              <thead className="bg-slate-600 text-base text-gray-300 ">
                <tr>
                  <th>S.N</th>
                  <th>id</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody className="">
                {data.map((users, index) => (
                  <tr
                    key={users._id}
                    className="border-b border-gray-100 hover:bg-gray-100"
                  >
                    <td>{index + 1}</td>
                    <td>{users._id}</td>
                    <td>{users.name}</td>
                    <td>{users.category}</td>
                    <td>{users.phone}</td>
                    <td>{users.email}</td>
                    <td>{users.role}</td>
                    {/* <td className="flex gap-2">
                      <button className="text-blue-500 hover:underline">
                        edit
                      </button>
                      <button className="text-blue-500 hover:underline">
                        delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

Users.Layout = AdminLayout;
export default Users;
