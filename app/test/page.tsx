'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function TextEmbedding() {
    const [file, setFile] = useState<File | null>(null)
    const [text, setText] = useState('')
    const [embedding, setEmbedding] = useState<number[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && selectedFile.type === 'text/plain') {
            setFile(selectedFile)
            const reader = new FileReader()
            reader.onload = (e) => {
                setText(e.target?.result as string)
            }
            reader.readAsText(selectedFile)
        } else {
            alert('Please select a valid .txt file')
        }
    }

    const generateEmbedding = async () => {
        if (!text) {
            alert('Please upload a .txt file first')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/generate-embedding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate embedding')
            }

            const data = await response.json()
            setEmbedding(data.embedding)
        } catch (error) {
            console.error('Error generating embedding:', error)
            alert('Error generating embedding. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-4">Text File to Embedding</h1>
            <Input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="mb-4"
            />
            {text && (
                <Textarea
                    value={text}
                    readOnly
                    className="mb-4 h-32"
                    placeholder="File content will appear here"
                />
            )}
            <Button
                onClick={generateEmbedding}
                disabled={!text || isLoading}
                className="w-full mb-4"
            >
                {isLoading ? 'Generating...' : 'Generate Embedding'}
            </Button>
            {embedding && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Embedding:</h2>
                    <Textarea
                        value={embedding.join(', ')}
                        readOnly
                        className="h-32"
                        placeholder="Embedding will appear here"
                    />
                </div>
            )}
        </div>
    )
}