import { useState } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import AuthPageLayout from "../components/AuthPageLayout";
import useLogin from "../hooks/useLogin";
import { useThemeStore } from "../store/useThemeStore.js";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { theme } = useThemeStore();

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: loginMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <AuthPageLayout
      title="Welcome Back"
      description="Sign in to your account to continue your language journey."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkTo="/signup"
      asideTitle="Connect with language partners worldwide"
      asideText="Practice conversations, make friends, and improve your language skills together."
      theme={theme}
    >
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error?.response?.data?.message || "Unable to sign in."}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <div className="relative">
            <MailIcon className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="email"
              placeholder="hello@example.com"
              className="input input-bordered w-full pl-10"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
              placeholder="••••••••"
              className="input input-bordered w-full pl-10"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </AuthPageLayout>
  );
};
export default LoginPage;
