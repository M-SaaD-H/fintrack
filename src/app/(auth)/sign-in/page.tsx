'use client';

import { Button } from '@/components/ui/button';
import { Form, FormMessage, FormControl, FormLabel, FormItem, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signinSchema } from '@/schemas/signin.schema'
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    console.log('Data:', data);
    setIsSubmitting(true);

    try {
      const res = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        console.log('Error in signing in:', res.error);
        toast.error('Sign in failed', {
          description: res.error || 'Signin failed'
        });
        
        return;
      }

      toast.success('Sign in successfully');
      router.replace('/dashboard');
    } catch (error: any) {
      console.log('Error in signing in:', error);
      toast.error('Sign in failed', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex justify-center items-center h-screen mx-8'>
      <div className="shadow-input mx-auto w-full max-w-md rounded-lg p-8 bg-neutral-900">
        <h2 className="text-xl font-bold text-neutral-200">
          Welcome back to FinTrack
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Login to your account to continue
        </p>

        <Form {...form}>
          <form className='my-8 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              variant={'secondary'} 
              type='submit' 
              className='w-full mt-6 group disabled:cursor-not-allowed' 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin' />
                  <span className='ml-2'>Signing in...</span>
                </>
              ) : (
                <>
                  Sign In <span className='group-hover:translate-x-1 transition-transform duration-300'>&rarr;</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignIn
