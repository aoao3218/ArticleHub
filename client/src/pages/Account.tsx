import { useState } from 'react';
import SignIN from '../components/SignIN';
import SignUP from '../components/SignUP';
import '../App.css';
import Header from '../components/Header';

const Account = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div>
      <Header />
      <div className="content" style={{ textAlign: 'center' }}>
        {isSignIn ? <SignIN /> : <SignUP />}
        <p>
          {isSignIn ? 'No account?' : 'Already have an account?'}
          <button id="changeTab" onClick={() => setIsSignIn(!isSignIn)}>
            {isSignIn ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Account;
