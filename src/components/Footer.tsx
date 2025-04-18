import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SocialIcons from './SocialsIcons'

const footerLinks1 = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Features',
    href: '/#features'
  },
  {
    name: '/benefits',
    href: '/#benefits'
  },
  {
    name: 'Testimonials',
    href: '/#testimonials'
  }
]

const footerLinks2 = [
  {
    name: 'Help Center',
    href: '/'
  },
  {
    name: 'FAQs',
    href: '/#faqs'
  },
  {
    name: 'Privary Policy',
    href: '/'
  },
  {
    name: 'Terms & Conditions',
    href: '/'
  }
]

function Footer() {
  return (
    <footer className='px-8 py-4'>
      <div className='flex flex-col md:flex-row justify-between'>
        <div>
          <div className='flex items-center'>
            <Image
              src={'/logo.png'}
              height={200}
              width={200}
              alt='Logo'
            />
            <span className='-ml-8 text-4xl font-sans tracking-tight font-semibold'>FinTrack</span>
          </div>
          <h2 className='-mt-8 md:ml-8 md:text-2xl text-lg font-semibold md:max-w-lg max-md:text-center'>Start managing your money smarter and achieve your financial goals with ease.</h2>
        </div>
        <div className='mt-8 md:mt-12 flex justify-center gap-24'>
          <ul>
            <h1 className='text-xl font-semibold my-6'>Quick Links</h1>
            {
              footerLinks1.map((l, i) => (
                <li key={i} className='font-medium my-2 w-max rounded-full'>
                  <Link href={l.href} className='peer'>{l.name}</Link>
                  <div className='h-0.5 rounded-4xl w-0 bg-white peer-hover:w-full transition-all' />
                </li>
              ))
            }
          </ul>

          <ul>
            <h1 className='text-xl font-semibold my-6'>Support & Resources</h1>
            {
              footerLinks2.map((l, i) => (
                <li key={i} className='font-medium my-2 w-max rounded-full'>
                  <Link href={l.href} className='peer'>{l.name}</Link>
                  <div className='h-0.5 rounded-4xl w-0 bg-white peer-hover:w-full transition-all' />
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className='flex flex-col-reverse md:flex-row items-center md:justify-between md:mx-8 mt-8 md:mt-36'>
        <p className='text-nowrap'>Copyright &copy; 2025 FinTrack. All rights are reserved.</p>
        <SocialIcons iconSize='28' />
      </div>
    </footer>
  )
}

export default Footer
