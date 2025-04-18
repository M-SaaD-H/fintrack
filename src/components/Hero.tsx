'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import Image from 'next/image'
import React from 'react'

function Hero() {
  const isMobile = useIsMobile();

  return (
    <div className='mt-16 flex flex-col items-center justify-center gap-4'>
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-600 to-white text-4xl md:text-7xl font-sans relative z-20 font-bold tracking-tight">
        Manage Finances <br /> Easily and Smartly.
      </h2>
      <p className='text-neutral-300 text-center mx-4'>FinTrack helps you control spending, track income, and manage savings with an intuitive financial dashboard.</p>

      <div className='md:mt-16 mt-8 relative flex justify-center items-center'>
        <div className='overflow-hidden border-2 border-white rounded-lg'>
          <Image src={'/hero.png'} height={555} width={!isMobile ? 1080 : 350} alt='Dashboard Image' className='h-auto w-auto' />
          <div className="absolute inset-0 bg-gradient-to-b from-10% to-90% from-transparent to-black/80" />
        </div>
        <div className='bg-purple-500/50 h-full md:w-[71rem] w-full absolute -z-1 blur-2xl' />
      </div>
      <div className='w-full h-20 -mt-16 blur-xl relative -z-10 bg-purple-500/70' />
    </div>
  )
}

export default Hero