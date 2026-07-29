import ForgotPasswordOTPForm from "@/components/auth/ForgotPasswordOTPForm";
import { Suspense } from "react";

const ForgotPasswordOTPPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordOTPForm />
    </Suspense>
  );
};

export default ForgotPasswordOTPPage;
