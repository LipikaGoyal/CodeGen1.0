"use client"
import React, { useContext, useState, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";

function CodeView() {
    const {id}= useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState({
        "/App.js": {
            code: `export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-500">Hello CodeGen!</h1>
      <p className="mt-2">Start editing to see some magic happen!</p>
    </div>
  );
}`
        }
    });
    const {messages, setMessages} = useContext(MessagesContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const convex = useConvex();

    const UpdateFiles=useMutation(api.workspace.UpdateFiles);

    useEffect(()=>{
        id&&GetFiles()
    },[id]);

    const GetFiles=async()=>{
        const result=await convex.query(api.workspace.GetWorkspace, {
            workspaceId:id
        });
        const mergedFiles = {
            ...Lookup.DEFAULT_FILE,
            ...result?.files
        };
        setFiles(mergedFiles);
    }

    useEffect(() => {
        if(messages?.length > 0) {
            const role = messages[messages?.length-1].role;
            if(role === 'user') {
                GenerateAiCode();
            }
        }
    }, [messages]);

    const GenerateAiCode = async () => {
        try {
            setLoading(true);
            setError(null);
            const PROMPT = JSON.stringify(messages) +" "+ Prompt.CODE_GEN_PROMPT;
            console.log("Sending prompt:", PROMPT);
            
            const response = await axios.post('/api/gen-ai-code', {
                prompt: PROMPT
            });
            
            console.log("AI Response:", response.data);
            
            if (response.data.files && typeof response.data.files === 'object') {
                const mergedFiles = {
                    ...Lookup.DEFAULT_FILE,
                    ...response.data.files
                };
                setFiles(mergedFiles);
                await UpdateFiles({
                    workspaceId:id,
                    files:response?.data.files
                })
                
                // Add AI response to messages
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: response.data.explanation || 'Generated code successfully'
                }]);
            } else {
                throw new Error('Invalid response format from AI');
            }
        } catch (error) {
            console.error("Error generating code:", error);
            setError(error.message);
            // Add error message to chat
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `Error generating code: ${error.message}`
            }]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <div className="bg-[#181818] p-2 w-full border">
                <div className="flex flex-wrap items-center shrink-0 bg-black p-1 w-[140px] gap-2 justify-center rounded-full">
                    <h2 onClick={()=>setActiveTab('code')} className={`text-sm cursor-pointer ${activeTab==='code' && 'text-blue-500  bg-blue-400 bg-opacity-25 p-1 px-2 rounded-full' }`}>
                        Code
                    </h2>
                    <h2 onClick={()=>setActiveTab('preview')} className={`text-sm cursor-pointer ${activeTab==='preview' && 'text-blue-500  bg-blue-400 bg-opacity-25 p-1 px-2 rounded-full' }`}>
                        Preview
                    </h2>
                </div>
            </div>
            {error && (
                <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">
                    {error}
                </div>
            )}
            {loading ? (
                <div className="flex items-center justify-center h-[73.5vh] bg-[#181818] opacity-70">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <SandpackProvider 
                    template="react"
                    theme="dark" 
                    files={files}
                    customSetup={{
                        dependencies: {
                            "react": "18.2.0",
                            "react-dom": "18.2.0",
                            ...Lookup.DEPENDANCY
                        }
                    }}
                    options={{
                        externalResources: ['https://cdn.tailwindcss.com']
                    }}
                >
                    <SandpackLayout>
                        {activeTab === 'code' && (
                            <>
                                <SandpackFileExplorer style={{ height: "73.5vh" }} />
                                <SandpackCodeEditor style={{ height: "73.5vh" }} />
                            </>
                        )}
                        {activeTab === 'preview' && (
                            <SandpackPreview 
                                style={{ height: "73.5vh" }}
                                showNavigator={true}
                                showRefreshButton={true}
                            />
                        )}
                    </SandpackLayout>
                </SandpackProvider>
            )}
        </div>
    );
}

export default CodeView;
