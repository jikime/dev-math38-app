import React, { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const LoginPageLayout = ({ children }: Props) => {
  return (
    <Suspense fallback={<div>로그인 페이지 중...</div>}>{children}</Suspense>
  );
};

export default LoginPageLayout;
