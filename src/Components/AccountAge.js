import React, { useState } from 'react';
import axios from 'axios';

const BOT_TOKEN = '7289349142:AAEnObwRhENGyPkNXXSqzO0txw4NzqSweYc';

const AccountAge = () => {
  const [userId, setUserId] = useState('');
  const [accountAge, setAccountAge] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  const fetchAccountAge = async () => {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMember`, {
        params: {
          chat_id: userId
        }
      });
      console.log('API response:', response.data);
      const user = response.data.result;

      if (!user || !user.date) {
        throw new Error('Invalid user data or missing date');
      }

      const currentDate = new Date();
      const userCreationDate = new Date(user.date * 1000); // Convert from seconds to milliseconds
      const accountAge = Math.floor((currentDate - userCreationDate) / (1000 * 60 * 60 * 24)); // Age in days
      
      setAccountAge(accountAge);
      setError(null);
    } catch (err) {
      console.error('Error:', err.message);
      setError('Failed to get account age');
      setAccountAge(null);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Telegram Account Age Checker</h1>
        <input
          type="text"
          placeholder="Enter Telegram User ID"
          value={userId}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={fetchAccountAge}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Check Account Age
        </button>
        {accountAge !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg">Account Age: <span className="font-bold">{accountAge}</span> days</p>
          </div>
        )}
        {error && (
          <div className="mt-4 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountAge;
