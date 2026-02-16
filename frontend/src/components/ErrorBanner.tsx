import React from "react";

interface ErrorBannerProps {
  msg: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ msg }) => (
  <div
    role="alert"
    className="mb-4 rounded-soft bg-red-50/80 dark:bg-red-900/90 backdrop-blur-sm border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-100 shadow-soft font-display tracking-editorial"
  >
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 mr-2 flex-shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c.73 0 1.813-1.874 1.948-3.374.21-2.295-1.79-4.18-3.158-4.87-.355-.18-.748-.28-1.158-.28H7.84c-.41 0-.803.1-1.158.28-1.368.69-3.368 2.575-3.158 4.87z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <span>{msg}</span>
    </div>
  </div>
);

export default ErrorBanner;
