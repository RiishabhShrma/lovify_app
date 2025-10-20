import { useState } from 'react';
import { Send, Sparkles, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { encryptText } from '../lib/encryption';
import Logo from './Logo';

interface WriteLetterProps {
  onLetterSent: (letterId: string) => void;
}

export default function WriteLetter({ onLetterSent }: WriteLetterProps) {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName || !recipientName || !subject || !content || !password) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Encrypt content first to get the salt
      const { encrypted: encryptedContent, iv: contentIv, salt } = await encryptText(content, password);
      
      // Encrypt subject with THE SAME SALT
      const { encrypted: encryptedSubject, iv: subjectIv } = await encryptText(subject, password, salt);

      const { data, error } = await supabase
        .from('letters')
        .insert({
          sender_name: senderName,
          recipient_name: recipientName,
          encrypted_subject: encryptedSubject,
          encrypted_content: encryptedContent,
          encryption_iv: contentIv,
          subject_iv: subjectIv,
          encryption_salt: salt  // Use the same salt for both
        })
        .select()
        .single();

      if (error) throw error;

      onLetterSent(data.id);
    } catch (error) {
      console.error('Error sending letter:', error);
      alert('Failed to send letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-serif text-gray-800 mb-2">Write Your Heart</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Send an encrypted letter to someone special
            <Sparkles className="w-4 h-4 text-amber-500" />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-rose-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all bg-white/50"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient's Name
              </label>
              <input
                type="text"
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all bg-white/50"
                placeholder="Their name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Letter Title
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all bg-white/50"
              placeholder="A special message for you..."
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Letter
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all resize-none bg-white/50 font-serif text-lg leading-relaxed"
              placeholder="Dear..."
              required
            />
          </div>

          <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-rose-600" />
              <label className="text-sm font-medium text-gray-700">
                Set a Password to Protect Your Letter
              </label>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all bg-white"
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all bg-white"
                placeholder="Confirm password"
                required
                minLength={6}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Share this password with your recipient so they can read the letter
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sealing your letter...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send with Love
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            🔒 Your letter is password-protected and encrypted. Only someone with the link and password can read it.
          </p>
        </form>
      </div>
    </div>
  );
}