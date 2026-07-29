import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
