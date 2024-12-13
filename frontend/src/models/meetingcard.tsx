import React from "react";

interface MeetingCardProps {
  name: string;
  date: string;
  time: string;
  email: string;
  onClick: () => void;
  onDelete?: () => void; // Optional handler for Delete
  isAdmin: boolean; // Flag to indicate admin access
}
const MeetingCard: React.FC<MeetingCardProps> = ({
  name,
  date,
  time,
  email,
  onClick,
  onDelete,
  isAdmin,
}) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 transition-transform transform hover:scale-105"
      onClick={onClick} // Card click handler
    >
      {/* Header with Conditional Edit and Delete Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {name}
        </h3>
        {isAdmin && (
          <div className="flex space-x-2">
         
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  onDelete();
                }}
                className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      {/* Meeting Details */}
      <p className="text-gray-600 dark:text-gray-400">
        {new Date(date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 dark:text-gray-400">{time}</p>
      <p className="text-gray-600 dark:text-gray-400">Email: {email}</p>
    </div>
  );
};


export default MeetingCard;
