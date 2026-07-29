import RegisterForm from "@/components/auth/RegisterForm";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default RegisterPage;
