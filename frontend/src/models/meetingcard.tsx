import React from "react";

interface MeetingCardProps {
  name: string;
  date: string;
  time: string;
  email: string;
  onClick: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  name,
  date,
  time,
  email,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 transition-transform transform hover:scale-105"
    >
      <h3 className="text-xl font-semibold text-black dark:text-white">
        {name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {new Date(date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 dark:text-gray-400">{time}</p>
      <p className="text-gray-600 dark:text-gray-400">Email: {email}</p>
    </div>
  );
};

export default MeetingCard;
