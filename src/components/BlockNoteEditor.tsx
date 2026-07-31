'use client';

import { useEffect } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';

interface BlockNoteEditorProps {
  initialHTML: string;
  onChange: (html: string) => void;
}

export default function BlockNoteEditor({ initialHTML, onChange }: BlockNoteEditorProps) {
  // Initialize BlockNote editor
  const editor = useCreateBlockNote();

  // Keep editor content in sync with initialHTML
  useEffect(() => {
    async function loadHTML() {
      if (!editor) return;
      
      const currentHTML = await editor.blocksToHTMLLossy(editor.document);
      // Only parse and replace if different, to avoid cursor jumping
      if (currentHTML !== initialHTML) {
        const blocks = await editor.tryParseHTMLToBlocks(initialHTML || '');
        editor.replaceBlocks(editor.document, blocks);
      }
    }
    loadHTML();
  }, [initialHTML, editor]);

  return (
    <div className="w-full text-foreground min-h-[300px] quicksand-editor">
      <style>{`
        .quicksand-editor .bn-container,
        .quicksand-editor .bn-editor,
        .quicksand-editor .bn-editor * {
          font-family: var(--font-quicksand), sans-serif !important;
        }
      `}</style>
      <BlockNoteView
        editor={editor}
        onChange={async () => {
          const html = await editor.blocksToHTMLLossy(editor.document);
          onChange(html);
        }}
        theme="light"
      />
    </div>
  );
}
