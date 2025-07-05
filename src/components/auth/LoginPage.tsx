import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { GoogleLogin } from './GoogleLogin';
import { trpc } from '../../lib/trpc';
import {
  Dumbbell,
  Activity,
  TrendingUp,
  Users,
  Zap,
  Target,
} from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLoginMutation = trpc.auth.googleLogin.useMutation();

  const handleGoogleSuccess = async (response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await googleLoginMutation.mutateAsync({
        googleToken: response.credential,
        name: response.user.name,
        email: response.user.email,
        avatarUrl: response.user.picture,
        googleId: response.user.googleId,
      });
      if (!result.user) {
        throw new Error('User not found');
      }
      login(result.token, result?.user);
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
    setError('Google login failed. Please try again.');
    console.error('Google login error:', error);
  };

  const features = [
    {
      icon: Dumbbell,
      title: 'Workout Tracking',
      description: 'Log your workouts with precision and ease',
    },
    {
      icon: Activity,
      title: 'Strength Assessment',
      description: 'Track your strength progression over time',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your fitness journey with detailed charts',
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set and achieve your fitness milestones',
    },
    {
      icon: Zap,
      title: 'Quick Workouts',
      description: 'Access pre-built workout routines instantly',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join the Gerald Athletic Club community',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E6D6] via-[#FAF7F2] to-[#E8D7C3]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left Side - Hero Content */}
            <div className="flex-1 flex flex-col justify-center py-12 lg:py-20">
              <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                {/* Logo */}
                <div className="flex items-center justify-center lg:justify-start mb-8">
                  <img
                    src="/gerald-athletic-club-logo.png"
                    alt="Gerald Athletic Club"
                    className="w-16 h-16 rounded-full border-3 border-[#8B9A5B] shadow-lg"
                  />
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-[#2C2C2C]">
                      Gerald Athletic Club
                    </h1>
                    <p className="text-[#2C2C2C]/60 text-sm">Fitness Tracker</p>
                  </div>
                </div>

                {/* Hero Text */}
                <div className="mb-8">
                  <h2 className="text-4xl lg:text-6xl font-bold text-[#2C2C2C] leading-tight mb-6">
                    Transform Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B]">
                      Fitness Journey
                    </span>
                  </h2>
                  <p className="text-xl text-[#2C2C2C]/70 leading-relaxed">
                    Track workouts, monitor progress, and achieve your fitness
                    goals with our comprehensive platform designed for athletes
                    of all levels.
                  </p>
                </div>

                {/* CTA Section */}
                <div className="mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 text-center">
                      Ready to start your journey?
                    </h3>

                    <div className="flex justify-center">
                      <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                      />
                    </div>

                    {error && (
                      <div className="mt-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {isLoading && (
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#8B9A5B] border-t-transparent"></div>
                        <span className="text-sm text-[#2C2C2C]/60">
                          Signing you in...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust Indicators */}
                {/* <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-[#2C2C2C]/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free to Use</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>No Ads</span>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Right Side - Features Grid */}
            <div className="flex-1 flex items-center justify-center py-12 lg:py-20">
              <div className="max-w-2xl w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:scale-105"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] rounded-lg flex items-center justify-center">
                            <Icon size={20} className="text-white" />
                          </div>
                          <h3 className="font-semibold text-[#2C2C2C]">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm text-[#2C2C2C]/70 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="relative">
        <svg
          className="absolute bottom-0 w-full h-20 text-white/20"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          fill="currentColor"
        >
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}
