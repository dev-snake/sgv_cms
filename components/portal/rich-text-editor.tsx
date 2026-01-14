"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const ToolbarButton = ({ 
  onClick, 
  isActive, 
  children, 
  tooltip 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
  tooltip?: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn(
      "h-9 w-9 p-0 rounded-none border-none",
      isActive ? "bg-slate-100 text-brand-primary" : "text-slate-500 hover:bg-slate-50"
    )}
    title={tooltip}
  >
    {children}
  </Button>
);

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    immediatelyRender: false,
    content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none min-h-[400px] p-6 focus:outline-none focus:ring-0",
          className
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Nhập URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Nhập URL hình ảnh:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full border border-slate-100 bg-white">
      <div className="flex flex-wrap items-center gap-px border-b border-slate-100 bg-slate-50/50 p-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          tooltip="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            tooltip="Heading 3"
        >
            <Heading3 size={18} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="Underline"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Ordered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Quote"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          tooltip="Code Block"
        >
          <Code size={18} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} tooltip="Link">
          <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} tooltip="Image">
          <ImageIcon size={18} />
        </ToolbarButton>
        
        <div className="ml-auto flex items-center">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} tooltip="Undo">
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} tooltip="Redo">
            <Redo size={18} />
          </ToolbarButton>
        </div>
      </div>
      
      <div className="relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <div className="absolute top-6 left-6 pointer-events-none text-slate-300 text-sm font-medium italic">
            {placeholder || "Bắt đầu nội dung tại đây..."}
          </div>
        )}
      </div>
    </div>
  );
}
