import React from "react";

interface ErrorBannerProps {
  msg: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ msg }) => (
  <div role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
    {msg}
  </div>
);

export default ErrorBanner;
