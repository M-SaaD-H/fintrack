'use client';
import { signupSchema } from '@/schemas/signup.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDebounceCallback } from 'usehooks-ts';
import { ApiError } from '@/utils/apiError';
import axios, { AxiosError } from 'axios';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiResponse } from '@/utils/apiResponse';

const SignUp = () => {
  // form fields
  const [username, setUsername] = useState('');

  // loading states
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // messages from api
  const [usernameMessage, setUsernameMessage] = useState('');

  const router = useRouter();
  const debounce = useDebounceCallback(setUsername, 300);

  useEffect(() => {
    if (!username) return;

    (async function () {
      setCheckingUsername(true);
      setUsernameMessage('');

      try {
        const response = await axios.get<ApiResponse>(`/api/check-username-unique/?username=${username}`);
        setUsernameMessage(response.data.message);
      } catch (error) {
        const apiError = error as AxiosError<ApiResponse>;
        setUsernameMessage(apiError.response?.data.message || 'Error in checking username');
      } finally {
        setCheckingUsername(false);
      }
    })();
  }, [username]);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);

    try {
      const res = await axios.post('/api/sign-up', {
        ...data,
        fullName: {
          firstName: data.firstName,
          lastName: data.lastName,
        }
      });
      toast.success('Signup successful', {
        description: res.data?.message || 'Signup successful'
      });
      router.replace('/sign-in');
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse>;
      toast.error('Signup failed', {
        description: apiError.response?.data.message || 'Failed to signup',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen mx-4'>
      <div className="shadow-input mx-auto mt-16 w-full max-w-md rounded-lg p-8 md:bg-neutral-900">
        <h2 className="text-xl font-bold text-neutral-200">
          Welcome to FinTrack
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Take Control of Your Finances - Track, Save, and Grow!
        </p>

        {/* form */}

        <Form {...form}>
          <form className='my-8 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-2">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-neutral-200 ml-2'>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-neutral-200 ml-2'>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-neutral-200 ml-2'>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example_123"
                      onChange={(e) => {
                        field.onChange(e);
                        debounce(e.target.value);
                      }}
                    />
                  </FormControl>
                  {checkingUsername && <Loader2 className='animate-spin text-neutral-200' />}
                  {!checkingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${usernameMessage === 'Username is unique'
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-neutral-200 ml-2'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-neutral-200 ml-2'>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant={'secondary'} type='submit' className='w-full my-4 group disabled:cursor-not-allowed' disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className='animate-spin' />
                    <span className='ml-2'>Signing up...</span>
                  </>
                ) : (
                  <>
                    Sign Up <span className='group-hover:translate-x-1 transition-transform duration-300'>&rarr;</span>
                  </>
                )
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignUp