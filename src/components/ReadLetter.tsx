import { useState, useEffect } from 'react';
import { Heart, Lock, Mail, Calendar, User, Eye, EyeOff, Unlock } from 'lucide-react';
import { supabase, type Letter } from '../lib/supabase';
import { decryptText } from '../lib/encryption';

interface ReadLetterProps {
  letterId: string;
}

export default function ReadLetter({ letterId }: ReadLetterProps) {
  const [letter, setLetter] = useState<Letter | null>(null);
  const [decryptedSubject, setDecryptedSubject] = useState('');
  const [decryptedContent, setDecryptedContent] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    loadLetterMetadata();
  }, [letterId]);

  const loadLetterMetadata = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('letters')
        .select('*')
        .eq('id', letterId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) {
        setError('Letter not found');
        return;
      }

      setLetter(data);
    } catch (err) {
      console.error('Error loading letter:', err);
      setError('Failed to load letter. The link might be invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !letter) return;

    setIsDecrypting(true);
    setDecryptError('');

    try {
      // 1. Decrypt Subject
      const subject = await decryptText(
        letter.encrypted_subject,
        letter.subject_iv, 
        letter.encryption_salt,
        password
      );

      // 2. Decrypt Content
      const content = await decryptText(
        letter.encrypted_content,
        letter.encryption_iv, // Uses the 'encryption_iv' column
        letter.encryption_salt,
        password
      );

      setDecryptedSubject(subject);
      setDecryptedContent(content);
      setIsUnlocked(true);

      if (!letter.read_at) {
        await supabase
          .from('letters')
          .update({ read_at: new Date().toISOString() })
          .eq('id', letterId);
      }
    } catch (err) {
      console.error('Error decrypting letter:', err);
      setDecryptError('Wrong password. Please try again.');
    } finally {
      setIsDecrypting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 text-lg">Loading your letter...</p>
        </div>
      </div>
    );
  }

  if (error || !letter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-2">Letter Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mb-4 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-serif text-gray-800 mb-2">You've Got Mail!</h1>
            <p className="text-gray-600 text-lg mb-1">
              From <span className="font-medium text-rose-600">{letter.sender_name}</span> to{' '}
              <span className="font-medium text-rose-600">{letter.recipient_name}</span>
            </p>
            <p className="text-sm text-gray-500">
              {new Date(letter.created_at).toLocaleDateString()}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-rose-100">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-semibold text-gray-800">Enter Password to Unlock</h2>
              </div>
              <p className="text-gray-600 mb-4">
                This letter is password protected. Ask the sender for the password to read it.
              </p>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setDecryptError('');
                  }}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all bg-white"
                  placeholder="Enter the password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {decryptError && (
                <p className="text-red-500 text-sm mt-2">{decryptError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isDecrypting || !password}
              className="w-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDecrypting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Unlocking...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Unlock Letter
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              🔒 This letter is encrypted. Your password is never sent to our servers.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mb-4 shadow-lg animate-bounce">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-serif text-gray-800 mb-2">Your Letter</h1>
          <p className="text-gray-600">Read with your heart</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-rose-100">
          <div className="bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 p-6 text-white">
            <h2 className="text-3xl font-serif mb-4">{decryptedSubject}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-rose-50">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>From: {letter.sender_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>To: {letter.recipient_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(letter.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="font-serif text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                {decryptedContent}
              </div>
            </div>
          </div>

          <div className="border-t border-rose-100 p-6 bg-rose-50/50">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4 text-rose-500" />
              <span>This letter was password-protected and encrypted for your eyes only</span>
            </div>
          </div>
        </div>

        {letter.read_at && (
          <p className="text-center text-sm text-gray-500 mt-4">
            First opened on {new Date(letter.read_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
