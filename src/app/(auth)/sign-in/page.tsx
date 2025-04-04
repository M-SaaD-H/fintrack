'use client';

import { Button } from '@/components/ui/button';
import { Form, FormMessage, FormControl, FormLabel, FormItem, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/formInput';
import { signinSchema } from '@/schemas/signin.schema'
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IconBrandGoogle } from '@tabler/icons-react';

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
    } catch (error) {
      console.log('Error in signing in:', error);
      toast.error('Sign in failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex justify-center items-center h-screen mx-8'>
      <Card className="shadow-input mx-auto w-full max-w-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-neutral-200">
            Welcome back to FinTrack
          </CardTitle>
          <CardDescription className="max-w-sm text-sm text-neutral-300">
            Login to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-neutral-200 ml-2'>Email / Username</FormLabel>
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
                    <FormLabel className='text-neutral-200 ml-2'>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
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
            Don&apos;t have an account?
          </p>
          <Link href='/sign-up' className='text-sm text-neutral-300 underline underline-offset-4'>Sign up</Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
