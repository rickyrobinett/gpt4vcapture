import { Hono } from 'hono'
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/chat";

type Bindings = {
    OPENAI_API_KEY: string
  }

const app = new Hono<{ Bindings: Bindings }>()

app.post('/react', async (c) => {
    const systemPrompt: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: `You are Artificial Intelligence (GPT) receiving images and reacting to them in the style of YouTube reactions. Be funny.`
        }
    ];
    
    let messages: ChatCompletionMessageParam[] = systemPrompt;
    
    const openai = new OpenAI({
        apiKey:  c.env.OPENAI_API_KEY
    });

    const blob = await c.req.raw.blob();

    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }    

    const base64 = "data:image/png;base64," + btoa(binary);
    
    messages.push({
        role: "user",
        content: [
            { type: "text", text: `Here's a part of the video. Give your reaction` },
            {
                type: "image_url",
                image_url: {
                    "url": base64,
                },
            },
        ],
    }) 

    console.log("making request");

    const response = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-4-vision-preview",
        max_tokens: 4096
    });

    console.log("request complete");

    console.log(response.choices[0].message.content);

    messages.push({
        role: "assistant",
        content: response.choices[0].message.content
    }) 

    console.log("tts start");

    const input = response.choices[0].message.content || "";
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: input,
    });
    
    const audioBuffer = await mp3.arrayBuffer();

    console.log("tts complete");

    // Set appropriate headers
    c.header('Content-Type', 'audio/mpeg');
    c.header('Content-Length', audioBuffer.byteLength.toString());

    return c.body(audioBuffer);

  })

export default app
