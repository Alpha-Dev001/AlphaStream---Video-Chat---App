import { useState } from "react";
import { MailIcon, LockIcon, UserIcon } from "lucide-react";
import AuthPageLayout from "../components/AuthPageLayout";

import useSignUp from "../hooks/useSignUp";
import { useThemeStore } from "../store/useThemeStore.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { theme } = useThemeStore();

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: signupMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <AuthPageLayout
      title="Create an Account"
      description="Join AlphaStream and start your language learning adventure!"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
      asideTitle="Connect with language partners worldwide"
      asideText="Practice conversations, make friends, and improve your language skills together."
      theme={theme}
    >
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error?.response?.data?.message || "Unable to create account."}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <div className="relative">
              <UserIcon className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full pl-10"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <MailIcon className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="email"
                placeholder="john@gmail.com"
                className="input input-bordered w-full pl-10"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <LockIcon className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full pl-10"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
            </div>
            <p className="text-xs opacity-70 mt-1">Password must be at least 6 characters long</p>
          </div>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input type="checkbox" className="checkbox checkbox-sm" required />
            <span className="text-xs leading-tight">
              I agree to the <span className="text-primary hover:underline">terms of service</span> and <span className="text-primary hover:underline">privacy policy</span>
            </span>
          </label>
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </AuthPageLayout>
  );
};

export default SignUpPage;
