"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '@/components/custom/Header'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailsContext } from '@/context/UserDetailContext'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'

function Provider({children}) {
    const [messages, setMessages]=useState([]);
    const [userDetails, setUserDetails]=useState();
    const convex=useConvex();
    useEffect(()=>{
        IsAuthenticated();
    },[])

    const IsAuthenticated=async()=>{
        if(typeof window !=undefined){
            const user = JSON.parse(localStorage.getItem('user'));
            console.log("User from local storage:", user);
            if (user?.email) {
                const result=await convex.query(api.users.GetUser, {
                    email:user.email
                })
                console.log("User details from DB:", result);
                setUserDetails(result);
            }
        }
    }
  return (
    <div>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
        <UserDetailsContext.Provider value={{userDetails, setUserDetails}}>
        <MessagesContext.Provider value={{messages,setMessages}}>
        <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange>
        <Header/>
        {children}
        </NextThemesProvider>
        </MessagesContext.Provider>
        </UserDetailsContext.Provider>
        </GoogleOAuthProvider>
    </div>
  )
}

export default Provider