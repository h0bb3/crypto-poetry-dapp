import React from 'react';
import { Link } from 'react-router-dom';
import RefrigeratorMagnetPoem from './RefrigeratorMagnetPoem';

interface Poem {
  id: string;
  title: string;
  content: string;
}

interface UserPoemListProps {
  poems: Poem[];
  isLoading: boolean;
}

const UserPoemList: React.FC<UserPoemListProps> = ({ poems, isLoading }) => {
  if (isLoading) {
    return <div className="text-center mt-8 text-pink-300">Loading your poems...</div>;
  }

  return (
    <div className="mt-8">
      
      {poems.length === 0 ? (
        <p className="text-center text-pink-200">You haven't created any poems yet.</p>
      ) : (
        <ul className="space-y-1">
          {poems.map((poem) => (
            <li key={poem.id} className="transition duration-300 ease-in-out transform hover:scale-105 hover:bg-opacity-50">
              <Link 
                to={`/poem/${poem.id}`}
                className="text-pink-300 hover:text-pink-100 font-medium block truncate"
              >
                <RefrigeratorMagnetPoem poem={poem.title} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPoemList;