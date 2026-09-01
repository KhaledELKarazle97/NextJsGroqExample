# Groq Chatbot + OCR Demo (Next.js + shadcn/ui)

A small teaching example for a web development course. It shows two things:

1. **A chatbot** — sends messages to a Groq language model and shows the reply.
2. **OCR** — uploads an image and asks a Groq *vision* model to read the text in it (no separate OCR library needed — the language model does the reading).

Both features are built the same way: a page in `app/` calls a route in
`app/api/`, and that route is the only place the Groq API key is used. This
keeps the secret key on the server and out of the browser.

## 1. Install dependencies

```bash
npm install
```

## 2. Add your Groq API key

1. Create a free key at [console.groq.com/keys](https://console.groq.com/keys).
2. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Open `.env.local` and paste your key:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

## 3. Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx            → home page with links to both demos
  chat/page.tsx        → chatbot UI (client component)
  ocr/page.tsx          → OCR upload UI (client component)
  api/chat/route.ts     → server route that calls Groq's chat completions
  api/ocr/route.ts       → server route that sends an image to a Groq vision model
components/
  ui/                    → small shadcn-style components (button, card, input, textarea)
  nav.tsx                → top navigation bar
lib/utils.ts             → the `cn()` class-merging helper shadcn components use
```

## How the chatbot works

`app/chat/page.tsx` keeps the conversation in React state and POSTs the
whole message list to `/api/chat` each time you send a message. The route
in `app/api/chat/route.ts` adds a system prompt, forwards everything to
Groq using the official `groq-sdk` package, and returns the assistant's
reply as JSON.

```ts
const completion = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [...],
});
```

## How the OCR works

`app/ocr/page.tsx` lets you pick an image file and shows a preview. When
you click **Extract text**, the file is sent as `multipart/form-data` to
`/api/ocr`. The route converts the image to a base64 data URL and sends it
to a Groq *vision-capable* model with a prompt asking it to transcribe the
text it sees:

```ts
const completion = await groq.chat.completions.create({
  model: "qwen/qwen3.6-27b",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Extract every piece of readable text..." },
        { type: "image_url", image_url: { url: dataUrl } },
      ],
    },
  ],
});
```

This is a great, low-effort way to add OCR to a project: no Tesseract or
image-processing library required, just a model call.

## Notes for students

- **Model names change.** Groq regularly retires and adds models. If a
  request fails with a "model not found" error, check
  [console.groq.com/docs/models](https://console.groq.com/docs/models) for
  current model ids and update `GROQ_CHAT_MODEL` / `GROQ_VISION_MODEL` in
  `.env.local` (or the defaults in the two route files).
- **Never expose your API key in client code.** Notice that `fetch()` calls
  in the two page components always hit our own `/api/...` routes, never
  `api.groq.com` directly.
- **Ideas to extend this demo:**
  - Stream the chatbot's reply token-by-token instead of waiting for the
    full response (Groq supports `stream: true`).
  - Add a "system prompt" text box so users can change the assistant's
    personality.
  - Store chat history in `localStorage` so it survives a page refresh.
  - Show a loading skeleton instead of a spinner.
  - Let the OCR page accept drag-and-drop, or paste-from-clipboard.
"# NextJsGroqExample" 
