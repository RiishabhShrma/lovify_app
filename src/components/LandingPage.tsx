import { Heart, Lock, Send, Sparkles, Mail, Shield, Eye } from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Logo size="md" />
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Write a Letter
          </button>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-rose-600 font-medium mb-6 border border-rose-200 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Express Your Heart, Securely
              <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="text-6xl md:text-7xl font-serif text-gray-800 mb-6 leading-tight">
              Send Love Letters
              <br />
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                That Touch Hearts
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Write heartfelt messages to the ones you love. Protected by password encryption,
              your words remain private and meaningful, just between you and them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Get Started Free
              </button>
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold text-lg border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 hover:scale-105"
              >
                See How It Works
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-rose-100">
              <div className="aspect-video bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4 animate-pulse">
                    <Mail className="w-10 h-10 text-rose-500" />
                  </div>
                  <p className="text-gray-600 font-serif text-lg">Your beautiful letter preview</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-serif text-center text-gray-800 mb-12">
              Why Choose LoveLetter?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Password Protected</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your letters are encrypted with a password only you and your recipient know.
                  True privacy for your most intimate thoughts.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Heart className="w-7 h-7 text-white fill-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Beautifully Simple</h3>
                <p className="text-gray-600 leading-relaxed">
                  Write your heart out with our elegant, distraction-free interface.
                  Focus on what matters: your words and feelings.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Send className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy to Share</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share a simple link via email, text, or any messenger.
                  Your recipient enters the password and reads your heartfelt message.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">End-to-End Encrypted</h3>
                <p className="text-gray-600 leading-relaxed">
                  Military-grade encryption ensures your letters are secure.
                  Not even we can read your private messages.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Read Receipts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Know when your letter is opened for the first time.
                  Share the moment your words reach their heart.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-rose-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Always Free</h3>
                <p className="text-gray-600 leading-relaxed">
                  Love shouldn't cost anything. Send unlimited letters,
                  completely free, forever. No hidden charges.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-serif text-white mb-4">
              Ready to Express Your Heart?
            </h2>
            <p className="text-rose-50 text-lg mb-8">
              Write your first love letter today. It takes less than a minute.
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-white text-rose-600 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Start Writing Now
            </button>
          </div>
        </div>

        <footer className="container mx-auto px-4 py-12 mt-20 border-t border-rose-200">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center gap-2 mb-2">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for lovers everywhere
            </p>
            <p className="text-sm text-gray-500">
              Your letters are encrypted and private. We never read your messages.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
