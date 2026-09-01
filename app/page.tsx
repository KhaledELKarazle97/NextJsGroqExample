import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Groq API Demo</h1>
        <p className="text-muted-foreground">
          A small Next.js app for the web development course. It shows two
          things you can build with the Groq API: a chatbot, and an OCR
          (text-from-image) tool. Both call Groq from a Next.js API route so
          the API key never reaches the browser.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot</CardTitle>
            <CardDescription>
              A simple chat interface that sends your messages to a Groq
              language model and streams back a reply.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button className="bg-red-700">Open chatbot</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OCR (image to text)</CardTitle>
            <CardDescription>
              Upload a photo or screenshot with text in it, and a Groq
              vision model will read it out for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ocr">
              <Button className="bg-red-700">Open OCR</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
