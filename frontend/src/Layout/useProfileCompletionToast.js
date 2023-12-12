import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { getUserProfile } from "@/api";

const useProfileCompletionToast = () => {
  const router = useRouter();
  const [profileIncompleteToastShown, setProfileIncompleteToastShown] =
    useState(false);
  const userProfile = useQuery({
    queryKey: ["UserProfile"],
    queryFn: () => getUserProfile(),
    retry: false,
    staleTime: 5000,
  });

  useEffect(() => {
    if (userProfile.isError && !profileIncompleteToastShown) {
      toast.error("Please complete your profile to continue");
      setProfileIncompleteToastShown(true);
      router.push("/account/profile");
    }
  }, [userProfile, profileIncompleteToastShown, router]);

  return profileIncompleteToastShown;
};

export default useProfileCompletionToast;
