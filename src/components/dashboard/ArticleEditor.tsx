"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export function ArticleEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noreferrer", target: "_blank" } }),
      Image,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "article-body min-h-[320px] rounded-b-xl bg-[#1e1e1e] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-white/10">
        <div className="h-12 border-b border-white/5 bg-[var(--color-panel)]" />
        <div className="min-h-[320px] animate-pulse bg-[#1e1e1e]" />
      </div>
    );
  }

  const btn = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-md transition ${
      active
        ? "bg-[var(--color-red)] text-white"
        : "text-white/80 hover:bg-white/5 hover:text-white"
    }`;

  const promptLink = () => {
    const url = window.prompt("الرابط:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const promptImage = () => {
    const url = window.prompt("رابط الصورة:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/5 bg-[var(--color-panel)] p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
          aria-label="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
          aria-label="Italic"
        >
          <Italic size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(editor.isActive("heading", { level: 2 }))}
          aria-label="H2"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btn(editor.isActive("heading", { level: 3 }))}
          aria-label="H3"
        >
          <Heading3 size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
          aria-label="قائمة نقطية"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
          aria-label="قائمة مرقمة"
        >
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
          aria-label="اقتباس"
        >
          <Quote size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <button
          type="button"
          onClick={promptLink}
          className={btn(editor.isActive("link"))}
          aria-label="رابط"
        >
          <LinkIcon size={15} />
        </button>
        <button
          type="button"
          onClick={promptImage}
          className={btn(false)}
          aria-label="صورة"
        >
          <ImageIcon size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={btn(false)}
          aria-label="تراجع"
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={btn(false)}
          aria-label="إعادة"
        >
          <Redo size={15} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
