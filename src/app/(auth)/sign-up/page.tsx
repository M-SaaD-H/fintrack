'use client';
import { signupSchema } from '@/schemas/signup.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/formInput';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiResponse } from '@/utils/apiResponse';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { IconBrandGoogle } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';

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
        const response = await axios.get<ApiResponse>(`/api/user/check-username-unique/?username=${username}`);
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
      <Card className="shadow-input mx-auto mt-16 w-full max-w-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-neutral-200">
            Welcome to FinTrack
          </CardTitle>
          <CardDescription className="mt-2 max-w-sm text-sm text-neutral-300">
            Take Control of Your Finances - Track, Save, and Grow!
          </CardDescription>
        </CardHeader>

        {/* form */}

        <CardContent>
          <Form {...form}>
            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
              <Button type='submit' className='w-full mt-4 group disabled:cursor-not-allowed' disabled={isSubmitting}>
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

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent to-transparent via-neutral-700" />

          <Button variant={'secondary'}
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md px-8 py-6 font-medium text-black bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            onClick={() => signIn('google')}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
            <span className="text-sm text-neutral-300">
              Google
            </span>
          </Button>
          
        </CardContent>
        <CardFooter className='flex items-center justify-center gap-2'>
          <p className='text-sm text-neutral-300'>
            Already have an account?
          </p>
          <Link href='/sign-in' className='text-sm text-neutral-300 underline underline-offset-4'>Sign in</Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp