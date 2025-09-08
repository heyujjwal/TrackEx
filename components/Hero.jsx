"use client"
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
    const  imageRef= useRef()
    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100; // Adjust this value to control when the effect starts
            if(scrollPosition > scrollThreshold) {
                imageElement.classList.add('scrolled');
            } 
            else {
                imageElement.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=> window.removeEventListener('scroll', handleScroll);
        
    }, [])
  return (
    <div className='pb-20 px-4'>
        <div className='container mx-auto text-center'>
            <h1 className='text-5xl md:text-8xl lg:text-[105px] font-bold pb-6 gradient-title'>
                Track with Intelligence <br /> TrackEx 
            </h1>
            <p className='text-xl max-w-2xl mb-8 text-gray-600 mx-auto font-medium'>
                Low on budget? No worries! TrackEx is here to help you track your expenses and income with AI powered insights. Say goodbye to financial stress and hello to financial freedom with TrackEx!
            </p>
            <div className='flex justify-center gap-6 mb-12 flex-wrap'>
                <Link href="/dashboard">
                    <Button size="lg" className="px-8 text-md">Get Started</Button>
                </Link>
                <Link href="/demo">
                    <Button size="lg" variant={"outline"} className="px-8 text-md">Watch Demo</Button>
                </Link>
            </div>
            <div className='hero-image-wrapper'>
                <div ref={imageRef} className='hero-image'>
                <Image src="/Banner.png" alt="banner" width={1280} height={720} priority className='rounded-xl shadow-2xl border mx-auto'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero
