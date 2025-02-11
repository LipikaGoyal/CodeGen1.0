import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailsContext } from '@/context/UserDetailContext'
import { useRouter } from 'next/navigation'

function Header() {
    const {userDetails, setUserDetails} = useContext(UserDetailsContext);
    const router = useRouter();

    const navigateHome = () => {
        router.push('/');
    }

  return (
    <div className='p-4 flex justify-between items-center'>
        <div onClick={navigateHome} className='flex justify-center items-center cursor-pointer hover:opacity-80 transition-opacity'>
            <Image src={'/CodeGen.jpg'} alt='Logo' width={45} height={45} className='pl-4'/>
            <h1 className='text-xl'>CodeGen</h1>
        </div>
        
        {userDetails?.name ? (
          <div className=''>
            <div className='flex items-center gap-3 pr-4'>
              {userDetails.picture ? (
                <Image 
                  src={userDetails.picture}
                  alt='Profile'
                  width={32}
                  height={32}
                  className='rounded-full'
                  unoptimized
                  loader={({ src }) => src}
                />
              ) : (
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold'>
                  {userDetails.name[0]}
                </div>
              )}
              <div className='pr-2'>
                <div className='text-sm font-medium'>{userDetails.name}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex gap-5'>
            <Button variant="ghost">Sign In</Button>
            <Button className="text-white" style={{backgroundColor:Colors.BLUE}}>Get Started</Button>
          </div>
        )}
    </div>
  )
}

export default Header