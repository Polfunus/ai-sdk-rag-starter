import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest, NextResponse } from "next/server";
import { createResource } from "@/lib/actions/resources";

export async function POST(req: NextRequest) {

    const body = await req.json();
    const text = body.text;

    try {

        createResource({ content: text });

        return NextResponse.json({
            message: 'Embedding generated successfully',
        })

    } catch (error) {
        console.error('Error generating embedding:', error);
        return NextResponse.json({ error: 'Error generating embedding' }, { status: 500 });
    }
}