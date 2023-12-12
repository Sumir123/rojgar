import Link from "next/link";
import Logo from "../images/favicon2.png";
import Image from "next/image";

const AuthLayout = ({ children }) => {
  return (
    <>
      <div className=" text-slate-900 z-10 shadow-md  sticky px-4 md:px-12 py-3">
        <Link href="/" passHref>
          <Image className="block h-8 w-auto" src={Logo} alt="Rojgar Logo" />
        </Link>
      </div>
      <div className="">{children}</div>
    </>
  );
};

export default AuthLayout;
