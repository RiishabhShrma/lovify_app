import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import WriteLetter from './components/WriteLetter';
import ReadLetter from './components/ReadLetter';
import ShareLink from './components/ShareLink';

type View = 'landing' | 'write' | 'share' | 'read';

function App() {
  const [view, setView] = useState<View>('landing');
  const [letterId, setLetterId] = useState('');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setLetterId(hash);
      setView('read');
    }
  }, []);

  const handleGetStarted = () => {
    setView('write');
  };

  const handleLetterSent = (id: string) => {
    setLetterId(id);
    setView('share');
  };

  const handleWriteAnother = () => {
    setView('landing');
    setLetterId('');
    window.location.hash = '';
  };

  if (view === 'read' && letterId) {
    return <ReadLetter letterId={letterId} />;
  }

  if (view === 'share' && letterId) {
    return (
      <ShareLink
        letterId={letterId}
        onWriteAnother={handleWriteAnother}
      />
    );
  }

  if (view === 'write') {
    return <WriteLetter onLetterSent={handleLetterSent} />;
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
}

export default App;

