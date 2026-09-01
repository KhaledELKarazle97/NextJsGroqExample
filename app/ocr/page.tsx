"use client";

import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

export default function OcrPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setResultText(null);
    setError(null);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleExtract() {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResultText(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Request failed.");
      }

      setResultText(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">OCR</h1>
        <p className="text-sm text-muted-foreground">
          Upload an image and a Groq vision model will read the text in it
          via <code className="rounded bg-secondary px-1 py-0.5">/api/ocr</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload an image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-sm text-muted-foreground hover:bg-secondary/50"
          >
            <Upload className="h-6 w-6" />
            {file ? file.name : "Click to choose an image (PNG, JPG...)"}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected preview"
              className="max-h-64 w-auto rounded-md border object-contain"
            />
          )}

          <Button onClick={handleExtract} disabled={!file || isLoading} className="bg-red-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reading image&hellip;
              </>
            ) : (
              "Extract text"
            )}
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {resultText && (
            <div className="rounded-md border bg-secondary/30 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Extracted text
              </p>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm">
                {resultText}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
