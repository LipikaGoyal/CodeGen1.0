import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {prompt}=await req.json();

    try{
        const result= await chatSession.sendMessage(prompt);
        const AIresponse = result.response.text();

        return NextResponse.json({result:AIresponse});
    }
    catch(e){
        return NextResponse.json({result:e});
    }
    
}