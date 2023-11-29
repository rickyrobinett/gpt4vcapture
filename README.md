# Reacting to content with GPT-4V, OpenAI tts, Cloudflare Workers and Mac shortcuts

This repo shows you how to create an application on Cloudflare Workers that lets you have GPT-4V react to anything you are doing on your computer in real-time.

In order to run this application you need a:
- Cloudflare Account: This app can be run using the Workers free tier. [Sign up for free here](https://dash.cloudflare.com/sign-up).
- OpenAI Account and API Key: You can [Sign up for an account here](https://openai.com/) and [generate an API key here](https://platform.openai.com/api-keys)
- Mac or iOS device

# Set up (Mac Shortcuts)

This application works by running a Mac Shortcut that takes the following actions:
1) Takes a screenshot using the "Take screenshot" action
2) Resizes that screenshot to be smaller using the "Resize" action
3) Sends the resized screenshot to our Worker using the "Get contents of" action
4) Plays the sound returned by our Worker using the "Play sound" action

To do this you can create a new Shortcut called "GPTReact" and copy the Shortcut configuration in this screenshot:

<img width="695" alt="Screenshot 2023-11-29 at 9 23 36 AM" src="https://github.com/rickyrobinett/gptreact/assets/838096/3f90e4e5-4ef7-41a3-9313-6b9bf050818d">

# Set up (Cloudflare Workeres)

Clone this repo and then run:
```
npm install
```

After installing your dependencies you'll need to add your OpenAI API key as an environmental variable so we can use it to make our requests to OpenAI:
```
npx wrangler secret put OPENAI_API_KEY
```

With your secret set, you can run this application locally to try it out:
```
npm run dev
```

Copy and paste your local URL into the "Get contents of" action in your Shorcut and then run the shortcut. It will take about 10-15 seconds for GPT-V4 to generate a response to your image and then to use OpenAI's tts to create the audio to have that response spoken back to you.

Once you're done developing you can deploy your application with this command:
```
npm run deploy
```

After your application is deployed, update the URL in the "Get contents of" action in your shortcut.
