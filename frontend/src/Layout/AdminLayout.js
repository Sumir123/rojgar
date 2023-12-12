import Link from "next/link";
import Logo from "../images/favicon2.png";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { useStoreState } from "../../store";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

const AdminLayout = ({ children }) => {
  const { currentUser, clearAllUserData, getCurrentUser } = useStoreState();
  const router = useRouter();

  const handleLogout = () => {
    clearAllUserData();
    router.push("/account/login");
  };

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 text-white flex-shrink-0 w-1/6">
        <nav className="py-4 px-4 flex flex-col overflow-y-auto h-full">
          <div className="flex-1">
            <Link href="/" className="">
              <Image
                className="block px-2 mb-3 h-8 w-auto"
                src={Logo}
                alt="Rojgar Logo"
              />
            </Link>
            <ul className="flex-1">
              <li>
                <Link
                  className={`block py-2 px-4 hover:bg-gray-700 `}
                  href="/admin/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 px-4 hover:bg-gray-700"
                  href="/admin/users"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 px-4 hover:bg-gray-700"
                  href="/admin/posts"
                >
                  Job Posts
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 px-4 hover:bg-gray-700"
                  href="/admin/applications"
                >
                  Applications
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 px-4 hover:bg-gray-700"
                  href="/admin/categories"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          <div className="">
            <div className="flex gap-2 items-center py-2 px-4 ">
              <p>{data?.name}</p>
            </div>
            <div
              className="flex cursor-pointer gap-2 items-center py-2 px-4 hover:bg-gray-700"
              onClick={handleLogout}
            >
              <FiLogOut /> Log out
            </div>
          </div>
        </nav>
      </aside>
      <main className="flex-1 pt-4 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
