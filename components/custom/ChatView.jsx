"use client"

import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailsContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation'
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Lookup from '@/data/Lookup';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import ReactMarkdown from 'react-markdown'

function ChatView() {

    const {id} = useParams();
    const convex = useConvex();
    //Get messages context
    const {messages, setMessages} = useContext(MessagesContext);
    const {userDetails, setUserDetails} = useContext(UserDetailsContext);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading]=useState(false);
    const UpdateMessages=useMutation(api.workspace.UpdateMessages);

    const onGenerate=(input)=>{
        setMessages(prev=>[...prev,
            {
                role:'user',
                content:input
            }
        ])
        setUserInput('');
    }

    useEffect(() => {
        if (id) {
            getWorkspaceData();
        }
    }, [id]);

    //Get Workspace data using WorkspaceId
    const getWorkspaceData = async () => {
        try {
            const data = await convex.query(api.workspace.GetWorkspace, {
                workspaceId: id
            });
             //save messages
            if (data?.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Error fetching workspace:", error);
        }
    }

    const GetAiResponse=async()=>{
        setLoading(true);
        const PROMPT=JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result= await axios.post('/api/ai-chat',{
            prompt:PROMPT
        })
        console.log(result.data.result);
        const AiResp = {
            role:'ai',
            content: result.data.result
        }
        setMessages(prev=>[...prev, AiResp])

        await UpdateMessages({
            messages:[...messages, AiResp],
            workspaceId: id
        })
        setLoading(false);
    }

    useEffect(()=>{
        if(messages?.length>0){
            const role=messages[messages?.length-1].role;
            if(role=='user'){
                GetAiResponse();
            }
        }
    }, [messages])
  return (
    <div className='relative h-[81vh] flex flex-col'>
             <div className='flex-1 overflow-y-scroll scrollbar-hide'>
                {(Array.isArray(messages) ? messages : []).map((msg, index) => (
                <div key={index} className='p-3 rounded-lg mb-3 flex gap-2 items-start leading-7' style={{backgroundColor:Colors.CHAT_BACKGROUND}}>
                    {msg?.role === 'user' && userDetails?.picture && (
                        <Image 
                            src={userDetails.picture}
                            alt='userImg' 
                            width={35} 
                            height={35} 
                            className='rounded-full'
                            unoptimized
                            loader={({ src }) => src}
                        />
                    )}
                    <ReactMarkdown className='flex flex-col'>{msg.content}</ReactMarkdown>
                    
                </div>
                
                
            ))}

            {loading && <div className='p-3 rounded-lg mb-3 flex gap-2 items-start' style={{ backgroundColor: Colors.BACKGROUND }}>
                        <Loader2Icon className='animate-spin' />
                        <h2>Generating Response...</h2>
                    </div>}
        </div>
        <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
            data-gramm="false"
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor"
            />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default ChatView