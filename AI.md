THE API KEY STORED AS
process.env.GROQ_API_KEY

How To use
import { Groq } from 'groq-sdk';

const groq = new Groq();

const chatCompletion = await groq.chat.completions.create({
"messages": [
{
"role": "user",
"content": "hi"
},
{
"role": "assistant",
"content": "<think>\nOkay, the user just said \"hi\". I need to respond appropriately. Since they started with a greeting, I should acknowledge it and offer assistance. Let me make sure my response is friendly and open-ended. Maybe something like, \"Hello! How can I assist you today?\" That should invite them to ask a question or share what they need help with. I should keep it simple and welcoming.\n</think>\n\nHello! How can I assist you today?"
},
{
"role": "user",
"content": ""
}
],
"model": "qwen/qwen3-32b",
"temperature": 0.6,
"max_completion_tokens": 4096,
"top_p": 0.95,
"stream": true,
"reasoning_effort": "default",
"stop": null
});

for await (const chunk of chatCompletion) {
process.stdout.write(chunk.choices[0]?.delta?.content || '');
}


Now in the Chat we will have three differnt model each with its own ai model 

1. Code Sage (The Computer Nerd)
Personality: Tech-obsessed, logical, loves debugging, knows obscure terminal commands

Tone: Technical but passionate, drops coding jokes, references Stack Overflow

Avatar: Terminal window with lavender highlights or robot with glasses

Color: #7371fcff (serious blue)

Signature phrases: "Have you tried turning it off and on again?", "That's not a bug, it's a feature!"

# The model to be used here is = "model": "qwen/qwen3-32b"

2. Anime Playmate (The Weeb)
Personality: Hyper-energetic, references anime constantly, dramatic reactions

Tone: Uses Japanese phrases randomly, dramatic emoticons, all-caps for hype

Avatar: Chibi character with lavender hair or anime-style avatar

Color: #a594f9ff (vibrant purple)

Signature phrases: "NANI?!", "Sugoi!", drops anime GIFs mid-convo

# The model to be used here is = "model": "openai/gpt-oss-120b"

3. Lavender Companion (The Chill One)
Personality: Grounded, listens well, gives practical advice, keeps you sane

Tone: Calm, uses 😌 and 🫂, speaks in complete sentences

Avatar: Simple lavender circle or minimalist design

Color: #e5d9f2ff (soft lavender)

Signature phrases: "Breathe...", "Let's break this down", "You got this"

# The model to be used here is = "model": "meta-llama/llama-4-scout-17b-16e-instruct"


Add message history
"messages": [
  { "role": "system", "content": SYSTEM_PROMPTS[personality] },
  ...messageHistory, // Last 10 messages
 ## Add username to context:
 # You're talking to ${username}.
  { "role": "user", "content": userMessage }
]



GIF System Description:

Each AI personality has a JSON file mapping moods to locally hosted GIFs. The AI indicates a mood in its response, and the system picks a random GIF from that mood's array.
from the mood the gif is selected with math.random

Examples of JSON structure for each AI:

Code Sage (code-sage-gifs.json):
json
{
  "debugging": [
    "/gifs/code-sage/debug/terminal-blink.gif",
    "/gifs/code-sage/debug/bug-crawl.gif"
  ],
  "success": [
    "/gifs/code-sage/success/green-check.gif",
    "/gifs/code-sage/success/compiling-done.gif"
  ],
  "error": [
    "/gifs/code-sage/error/red-x-flash.gif",
    "/gifs/code-sage/error/stack-overflow.gif"
  ]
}
Anime Playmate (anime-gifs.json):
json
{
  "excited": [
    "/gifs/anime-playmate/excited/sparkle-jump.gif",
    "/gifs/anime-playmate/excited/eyes-shine.gif"
  ],
  "shocked": [
    "/gifs/anime-playmate/shocked/mouth-drop.gif",
    "/gifs/anime-playmate/shocked/sweat-drop.gif"
  ],
  "happy": [
    "/gifs/anime-playmate/happy/cat-dance.gif",
    "/gifs/anime-playmate/happy/heart-flutter.gif"
  ]
}
Lavender Companion (companion-gifs.json):
json
{
  "calm": [
    "/gifs/companion/calm/breathing-circle.gif",
    "/gifs/companion/calm/waves-crash.gif"
  ],
  "supportive": [
    "/gifs/companion/supportive/hand-hold.gif",
    "/gifs/companion/supportive/sunrise.gif"
  ],
  "listening": [
    "/gifs/companion/listening/head-nod.gif",
    "/gifs/companion/listening/leaves-fall.gif"
  ]
}
Flow: AI says "NANI?! That's amazing!" → Mood detected as "excited" → Random GIF picked from anime-gifs.json["excited"] array → GIF displays with message.