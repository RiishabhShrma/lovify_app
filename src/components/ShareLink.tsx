import { useState } from 'react';
import { Copy, Check, Mail, Heart, Share2, Key } from 'lucide-react';

interface ShareLinkProps {
  letterId: string;
  onWriteAnother: () => void;
}

export default function ShareLink({ letterId, onWriteAnother }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/#${letterId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Someone sent you a love letter 💌');
    const body = encodeURIComponent(
      `You've received a special password-protected letter!\n\nClick this link to read it:\n${shareUrl}\n\n💕 Ask me for the password to unlock your letter.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mb-4 shadow-lg animate-bounce">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-serif text-gray-800 mb-2">Letter Sent! 💌</h1>
          <p className="text-gray-600 text-lg">Your heartfelt message is ready to be shared</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-rose-100">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-rose-500" />
              Share this secure link with your special someone
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg border border-rose-300 bg-white text-sm font-mono focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={shareViaEmail}
              className="w-full py-4 bg-white border-2 border-rose-300 text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <Mail className="w-5 h-5" />
              Share via Email
            </button>

            <button
              onClick={onWriteAnother}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Write Another Letter
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Remember to Share the Password!
            </h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Share this link with your recipient via email, text, or messenger</li>
              <li>• Don't forget to separately share the password you created</li>
              <li>• Your recipient will need both the link AND password to read the letter</li>
              <li>• The letter is password-protected and encrypted end-to-end</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
