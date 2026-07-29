import OTPVerificationForm from "@/components/auth/OTPVerificationForm";
import { Suspense } from "react";

const OTPVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPVerificationForm />
    </Suspense>
  );
};

export default OTPVerificationPage;
