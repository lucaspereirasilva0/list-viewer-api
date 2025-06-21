import React from "react";

export function ItemSkeleton() {
  return (
    <li className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 animate-pulse">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    </li>
  );
}
