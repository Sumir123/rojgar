import Link from "next/link";
import Logo from "../images/favicon2.png";
import { useRouter } from "next/router";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import Image from "next/image";

const SignupNavbar = () => {
  const router = useRouter();

  const path = router.asPath;
  return (
    <>
      <nav className="text-slate-900 sticky w-full">
        <div className="mx-auto max-w-7xl px-2">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex justify-between">
              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <Image
                      className="block h-8 w-auto lg:hidden"
                      src={Logo}
                      alt="Rojgar logo"
                    />
                    <Image
                      className="hidden h-8 w-auto lg:block"
                      src={Logo}
                      alt="Rojgar Logo"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SignupNavbar;
