import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Home,
  Play,
  Activity,
  BarChart3,
  CheckCircle,
  Target,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
  });
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const recentWorkouts = [
    {
      day: 'Day 2',
      title: 'Push & Functional Focus',
      date: '2 days ago',
      exercises: 6,
      volume: '8,450 lbs',
    },
    {
      day: 'Day 1',
      title: 'Pull & Lower Focus',
      date: '4 days ago',
      exercises: 6,
      volume: '9,200 lbs',
    },
    {
      day: 'Day 3',
      title: 'Balanced Hypertrophy & Stability',
      date: '1 week ago',
      exercises: 6,
      volume: '7,800 lbs',
    },
  ];

  const quickStats = [
    { label: 'This Week', value: '2', unit: 'workouts' },
    { label: 'Total Volume', value: '17.6k', unit: 'lbs' },
    { label: 'Avg Duration', value: '52', unit: 'min' },
    { label: 'Consistency', value: '85%', unit: 'rate' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 p-4 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-2 sm:mb-4">
          <Home className="w-8 h-8 sm:w-12 sm:h-12 text-[#8B9A5B] mr-3" />
          <h1 className="text-2xl sm:text-4xl font-semibold text-[#2C2C2C]">
            Dashboard
          </h1>
        </div>
        <p className="text-base sm:text-lg text-[#2C2C2C]/80">
          Welcome back! Ready for {dayOfWeek}?
        </p>
        <p className="text-sm text-[#2C2C2C]/60 mt-1">{formattedDate}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/workout"
          className="bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] hover:from-[#6B7A4B] hover:to-[#5A6940] text-white rounded-xl p-6 transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong"
        >
          <div className="flex items-center justify-between">
            <div>
              <Play className="w-8 h-8 mb-2" />
              <h3 className="text-xl font-bold mb-1">Start Workout</h3>
              <p className="text-white/80 text-sm">
                Begin your next training session
              </p>
            </div>
            <div className="text-3xl opacity-20">→</div>
          </div>
        </Link>

        <Link
          to="/strength"
          className="bg-gradient-to-r from-[#6B7A4B] to-[#2C2C2C] hover:from-[#5A6940] hover:to-[#1A1A1A] text-white rounded-xl p-6 transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong"
        >
          <div className="flex items-center justify-between">
            <div>
              <Activity className="w-8 h-8 mb-2" />
              <h3 className="text-xl font-bold mb-1">Strength Check</h3>
              <p className="text-white/80 text-sm">
                Assess your current strength levels
              </p>
            </div>
            <div className="text-3xl opacity-20">→</div>
          </div>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-6 h-6 text-[#8B9A5B] mr-2" />
          <h2 className="text-xl font-semibold text-[#2C2C2C]">Quick Stats</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-[#FAF7F2] to-[#F0E6D6] rounded-xl p-4 text-center border border-[#E8D7C3]"
            >
              <div className="text-2xl font-semibold text-[#2C2C2C] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#2C2C2C]/80">{stat.label}</div>
              <div className="text-xs text-[#2C2C2C]/60">{stat.unit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-[#8B9A5B] mr-2" />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">
              Recent Workouts
            </h2>
          </div>
          <Link
            to="/history"
            className="text-[#8B9A5B] hover:text-[#6B7A4B] text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <div
              key={index}
              className="bg-white border border-[#E8D7C3] rounded-xl p-4 hover:shadow-soft transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-[#2C2C2C]">
                      {workout.day}
                    </span>
                    <span className="text-sm text-[#2C2C2C]/60">
                      {workout.date}
                    </span>
                  </div>
                  <h3 className="font-medium text-[#2C2C2C]/90 mb-1">
                    {workout.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-[#2C2C2C]/70">
                    <span>{workout.exercises} exercises</span>
                    <span>{workout.volume} volume</span>
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-[#8B9A5B]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] text-white rounded-xl p-6 text-center">
        <Target className="w-12 h-12 mx-auto mb-2" />
        <h3 className="text-xl font-semibold mb-2">Stay Consistent!</h3>
        <p className="text-white/80 text-sm">
          You've worked out 2 times this week. Keep up the great momentum!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
