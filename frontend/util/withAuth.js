// // withAuth.js
// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import { useStoreState } from "../store";

// const ProtectRoute = () => {
//   const router = useRouter();
//   const { currentUser, getCurrentUser } = useStoreState();

//   useEffect(() => {
//     const checkUserRole = () => {
//       if (!currentUser) {
//         getCurrentUser();
//       } else {
//         const { role } = currentUser;

//         if (role === "admin") {
//           router.push("/admin/dashboard");
//         } else if (role === "jobseeker") {
//           router.push("/jobseeker/dashboard");
//         } else if (role === "employer") {
//           router.push("/employer/dashboard");
//         } else {
//           router.push("/account/login");
//         }
//       }
//     };

//     checkUserRole();
//   }, [currentUser]);

//   return null;
// };

// export default ProtectRoute;
