import React from 'react'
import { BentoGrid, BentoGridItem } from './ui/bento-grid'

const items = [
  {
    title: 'Comprehensive Financial Overview',
    description: 'View your total balance and expenses at a glance to stay at the top of your finances.',
    image: '/cards.png',
    className: 'md:col-span-2'
  },
  {
    title: 'Smart Saving Plan',
    description: 'Create, manage and achieve your savings goals with a plan tailored to your needs.',
    image: '/coming-soon.webp',
    className: 'md:col-span-1',
    upcoming: true
  },
  {
    title: 'Stay on Top of Your Expenses',
    description: 'Log and categorize expenses with amount, date, and notes to monitor and analyze your spending habits.',
    image: '/data-table.png',
    className: 'md:col-span-1'
  },
  {
    title: 'Smart Income & Expense Analytics',
    description: 'Monitor, analyze and optimize your income and expense with real-time data.',
    image: '/chart.png',
    className: 'md:col-span-2',
    upcoming: true
  }
];

function Features() {
  return (
    <section id='features' className='bg-black -mt-16 p-16 relative z-50 w-full'>
      <h2 className='md:text-6xl text-2xl font-sans font-semibold tracking-tight text-center text-nowrap my-4'>Powerful Features to Elevate <br /> You Fianncially</h2>
      <p className='text-neutral-300 text-center max-w-md text-wrap mx-auto'>All the tools you need to manage your money - smart, simple and seamless.</p>
      <BentoGrid className="max-w-5xl mx-auto md:auto-rows-[20rem] my-8">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            image={item.image}
            className={item.className}
            upcoming={item?.upcoming}
          />
        ))}
      </BentoGrid>
    </section>
  )
}

export default Features
