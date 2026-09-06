'use client'

import { useEffect, useRef } from 'react'

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
}

const BUTTONS: { label: string; command: string; value?: string }[] = [
  { label: 'B', command: 'bold' },
  { label: 'I', command: 'italic' },
  { label: 'H2', command: 'formatBlock', value: 'h2' },
  { label: 'H3', command: 'formatBlock', value: 'h3' },
  { label: 'P', command: 'formatBlock', value: 'p' },
  { label: '• List', command: 'insertUnorderedList' },
  { label: '1. List', command: 'insertOrderedList' },
  { label: '" Quote', command: 'formatBlock', value: 'blockquote' },
]

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (ref.current && !hasInitialized.current) {
      ref.current.innerHTML = value || ''
      hasInitialized.current = true
    }
  }, [value])

  function exec(command: string, cmdValue?: string) {
    ref.current?.focus()
    document.execCommand(command, false, cmdValue)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  function handleInsertLink() {
    const url = window.prompt('Enter URL:')
    if (url) exec('createLink', url)
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => exec(btn.command, btn.value)}
            className="text-xs px-2.5 py-1.5 rounded border border-gray-200 hover:bg-gray-100 transition font-medium"
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleInsertLink}
          className="text-xs px-2.5 py-1.5 rounded border border-gray-200 hover:bg-gray-100 transition font-medium"
        >
          🔗 Link
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="min-h-[280px] p-4 text-sm leading-relaxed focus:outline-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_p]:mb-3"
      />
    </div>
  )
}
