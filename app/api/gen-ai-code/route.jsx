import { GenAICode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {prompt} = await req.json();

    try {
        const result = await GenAICode.sendMessage(prompt);
        const AIresponse = await result.response.text();
        console.log("Raw AI Response:", AIresponse);
        
        // Try to extract JSON from the response
        const jsonMatch = AIresponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsedResponse = JSON.parse(jsonMatch[0]);
                console.log("Parsed Response:", parsedResponse);
                
                // Validate the response structure
                if (!parsedResponse.files || typeof parsedResponse.files !== 'object') {
                    throw new Error('Invalid response structure');
                }
                
                return NextResponse.json(parsedResponse);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                // Fall back to default structure
                return NextResponse.json({
                    projectTitle: "Generated Project",
                    explanation: "Generated code from AI",
                    files: {
                        "/App.js": {
                            code: AIresponse
                        }
                    },
                    generatedFiles: ["/App.js"]
                });
            }
        } else {
            console.log("No JSON found in response, using raw text");
            // If no JSON found, wrap the raw text in our structure
            return NextResponse.json({
                projectTitle: "Generated Project",
                explanation: "Generated code from AI",
                files: {
                    "/App.js": {
                        code: AIresponse
                    }
                },
                generatedFiles: ["/App.js"]
            });
        }
    } catch(e) {
        console.error("AI Generation Error:", e);
        return NextResponse.json({ 
            error: e.message,
            details: e.stack 
        }, { status: 500 });
    }
}