import { NextResponse } from "next/server";

const middleware = async (request) => {
  try {
    const url = request.nextUrl.clone();
    const token = request.cookies.get("token");
    const userdata = request.cookies.get("userdata");
    const currentuserdata = userdata ? JSON.parse(userdata.value) : null;
    let role;

    role = currentuserdata ? currentuserdata.role : null;

    if (!token && !userdata) {
      if (
        url.pathname === "/account/login" ||
        url.pathname === "/account/signup"
      ) {
        return NextResponse.next();
      }
      if (
        url.pathname.includes("/jobseeker/") ||
        url.pathname.includes("/employer/") ||
        url.pathname.includes("/account/profile") ||
        url.pathname.includes("/admin/")
      ) {
        url.pathname = "/account/login";
        return NextResponse.redirect(url);
      }
    } else {
      if (
        url.pathname === "/account/login" ||
        url.pathname === "/account/register" ||
        url.pathname === "/login"
      ) {
        if (role === "admin") {
          url.pathname = "/admin/dashboard";
        } else if (role === "jobseeker") {
          url.pathname = "/jobseeker/dashboard";
        } else if (role === "employer") {
          url.pathname = "/employer/dashboard";
        }
        return NextResponse.redirect(url);
      }
      if (url.pathname === "/") {
        if (role === "admin") {
          url.pathname = "/admin/dashboard";
        } else if (role === "jobseeker") {
          url.pathname = "/jobseeker/dashboard";
        } else if (role === "employer") {
          url.pathname = "/employer/dashboard";
        }
        return NextResponse.redirect(url);
      }
      if (url.pathname.includes("/jobseeker/") && role !== "jobseeker") {
        url.pathname = "/account/login";
        return NextResponse.redirect(url);
      }
      if (url.pathname.includes("/employer/") && role !== "employer") {
        url.pathname = "/account/login";
        return NextResponse.redirect(url);
      }
      if (url.pathname.includes("/admin/") && role !== "admin") {
        url.pathname = "/account/login";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.next();
  }
};

export default middleware;

export const config = {
  matcher: [
    "/",
    "/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/jobseeker/:path*",
    "/employer/:path*",
    "/login",
    "/register",
  ],
};
