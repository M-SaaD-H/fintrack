import Image from 'next/image'
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const faqs = [
  {
    trigger: 'What is FinTrack?',
    content: 'FinTrack is a simple yet powerful tool that helps you monitor your expenses, set budgets, and gain insights into your financial habits — all in one clean dashboard.'
  },
  {
    trigger: 'Is FinTrack free to use?',
    content: 'Yes! FinTrack offers a completely free version to get started. We may add premium features in the future, but the core functionality will always stay free.'
  },
  {
    trigger: 'Can I track multiple budgets or categories?',
    content: 'Yes! You can organize your expenses by categories like food, travel, rent, etc., and set budgets for each of them.'
  },
  {
    trigger: 'Do I need to link my bank account?',
    content: 'Nope. You can manually add your expenses or import them from files. Bank integration is optional (coming soon) and will always be secure.'
  },
  {
    trigger: 'Is my data safe with FinTrack?',
    content: 'Absolutely. Your privacy is our priority. All your data is securely stored and encrypted. We will never sell or share your financial info.'
  },
  {
    trigger: 'How often is FinTrack updated?',
    content: "We're constantly improving based on user feedback. Expect regular updates and new features to keep your experience smooth and powerful."
  }
]

function FAQs() {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center flex-col md:flex-row md:gap-24 gap-4'>
        <h1 className='md:text-6xl text-3xl font-sans font-semibold tracking-tight md:text-nowrap max-md:text-center'>A Smarter Way to <br /> Manage Your Money</h1>
        <p className='md:max-w-4xl max-md:w-full max-md:text-center text-wrap'>Built for Professional and Business. Fintrack provides seamless, secure, and intuitive financial management.</p>
      </div>
      
      <div className='my-8 flex flex-col md:flex-row justify-between max-md:gap-8'>
        <div className='md:max-w-[40rem] h-max max-md:mx-8 rounded-lg overflow-hidden relative border border-white/[0.2]'>
          <Image
            src={'/hero.png'}
            width={800}
            height={500}
            alt='Dashboard Image'
            className='w-full object-cover'
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-40% to-100% from-transparent to-black/80" />
        </div>
        <div>
          <Accordion type='single' collapsible className='md:w-xl max-md:mx-8'>
            {
              faqs.map((f, i) => (
                <AccordionItem value={`item-${i}`} key={i}>
                  <AccordionTrigger>{f.trigger}</AccordionTrigger>
                  <AccordionContent>{f.content}</AccordionContent>
                </AccordionItem>
              ))
            }
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default FAQs
