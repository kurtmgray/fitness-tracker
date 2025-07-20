import React from 'react';
import { trpc } from '@/lib/trpc';

export const ApiTest: React.FC = () => {
  const { data: actualMaxes, isLoading, error } = trpc.strength.getActualMaxes.useQuery();
  const { data: sessions } = trpc.workouts.getUserSessions.useQuery({ limit: 5 });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md m-4">
      <h2 className="text-xl font-bold mb-4">🧪 API Debug Panel</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold">Strength Assessment Data:</h3>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {actualMaxes && (
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(actualMaxes, null, 2)}
          </pre>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Workout Sessions:</h3>
        {sessions && (
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(sessions, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};