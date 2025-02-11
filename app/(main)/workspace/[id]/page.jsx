import React from 'react'
import ChatView from '@/components/custom/ChatView'
import CodeView from '@/components/custom/CodeView'

function Workspace() {
  return (
    <div className='pl-10 pr-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          <div className='shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl rounded-lg border border-white/5'>
            <div className='p-6'>
              <ChatView/>
            </div>
          </div>
          <div className='col-span-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl rounded-lg border border-white/5'>
            <div className='p-6'>
              <CodeView/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Workspace