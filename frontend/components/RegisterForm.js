'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await api.register(data);
      router.push('/login');
    } catch (error) {
      setServerError(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' }
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            type="text"
            placeholder="Username"
          />
          {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            type="email"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' }
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
            type="password"
            placeholder="Password"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="mb-4 text-red-500 text-sm">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}