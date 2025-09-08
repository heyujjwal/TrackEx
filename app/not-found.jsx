import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='item-center justify-center flex flex-col min-h-[100vh] text-center px-4'>
        <h1 className='text-6xl font-bold mb-4 gradient-title'>404 - Page Not Found</h1>
        <p className='text-lg text-gray-600'>The page you are looking for does not exist.</p>
        <Link href='/' className='text-blue-600 hover:underline mt-4 inline-block'>
            <Button variant={'outline'}>
                Go to Homepage
            </Button>
        </Link>
    </div>
  )
}

export default NotFound
