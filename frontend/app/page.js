'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../lib/api';

export default function Home() {
  const [dialogs, setDialogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [phoneCodeHash, setPhoneCodeHash] = useState(''); // Added missing state
  const [isPhoneNumberEntered, setIsPhoneNumberEntered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchDialogs() {
      try {
        const telegramDialogs = await api.getTelegramDialogs();
        setDialogs(telegramDialogs);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch Telegram dialogs', error);
        setIsLoading(false);
        setErrorMessage('Failed to fetch dialogs');
      }
    }

    if (isAuthenticated) {
      setIsLoading(true);
      fetchDialogs();
    }
  }, [isAuthenticated]);

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous errors
    try {
      const response = await api.startTelegramAuth(phoneNumber);
      if (response && response.phone_code_hash) {
        setPhoneCodeHash(response.phone_code_hash);
        setIsPhoneNumberEntered(true);
      } else {
        throw new Error('No phone_code_hash received');
      }
    } catch (error) {
      console.error('Start auth error:', error);
      setErrorMessage('Failed to send Telegram code: ' + (error.message || ''));
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous errors
    try {
      if (!phoneCodeHash) {
        throw new Error('Missing phone_code_hash');
      }
      await api.verifyTelegramCode(phoneNumber, code, phoneCodeHash);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Code verification error:', error);
      setErrorMessage('Failed to verify Telegram code: ' + (error.message || ''));
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto mt-10 p-4">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {!isPhoneNumberEntered ? (
          <form onSubmit={handlePhoneNumberSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold">Enter your phone number to receive a Telegram code</h3>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number (e.g., +1234567890)"
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send Code
            </button>
          </form>
        ) : !isAuthenticated ? (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold">Enter the code sent to your phone</h3>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Telegram code"
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Verify Code
            </button>
          </form>
        ) : isLoading ? (
          <div className="text-center">
            <p>Loading dialogs...</p>
          </div>
        ) : dialogs.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Telegram Chats</h2>
            <ul className="space-y-2">
              {dialogs.map(dialog => (
                <li key={dialog.id} className="border-b py-2 flex justify-between items-center">
                  <span>{dialog.title}</span>
                  {dialog.unread_count > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {dialog.unread_count}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No Telegram chats found or Telegram session not configured.</p>
        )}
      </main>
    </div>
  );
}