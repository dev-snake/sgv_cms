"use client";

import { useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

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
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  Highlighter,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  CheckSquare,
  Type,
  Eraser,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaSelectorDialog } from "./media-selector-dialog";

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
  tooltip,
  disabled
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "h-8 w-8 p-0 rounded-none border-none",
      isActive ? "bg-slate-200 text-brand-primary font-bold" : "text-slate-600 hover:bg-slate-100"
    )}
    title={tooltip}
  >
    {children}
  </Button>
);

const Separator = () => <div className="w-px h-5 bg-slate-200 mx-1" />;

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg shadow-md my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        width: 640,
        height: 480,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Nhập nội dung bài viết...",
      }),
      CharacterCount,
    ],
    immediatelyRender: false,
    content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none min-h-[500px] p-8 focus:outline-none focus:ring-0 [&_table]:border-collapse [&_table]:w-full [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:bg-slate-50",
          className
        ),
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Địa chỉ URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    setIsMediaSelectorOpen(true);
  };

  const handleImageSelect = (url: string) => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
      setIsMediaSelectorOpen(false);
    }
  };

  const addYoutube = () => {
    const url = window.prompt("Dán link Youtube:");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  return (
    <div className="w-full border border-slate-200 bg-white rounded-md overflow-hidden transition-all focus-within:ring-2 focus-within:ring-brand-primary/20">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 p-1">
        {/* History Group */}
        <div className="flex items-center">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} tooltip="Hoàn tác (Ctrl+Z)">
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} tooltip="Làm lại (Ctrl+Y)">
            <Redo size={16} />
          </ToolbarButton>
        </div>

        <Separator />

        {/* Heading Group */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-slate-600">
              <Type size={16} />
              <span className="text-xs font-bold uppercase tracking-tighter">Tiêu đề</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>Văn bản thường</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="text-2xl font-bold">Tiêu đề 1</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="text-xl font-bold">Tiêu đề 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="text-lg font-bold">Tiêu đề 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator />

        {/* Text Styling Group */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            tooltip="In đậm"
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            tooltip="In nghiêng"
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            tooltip="Gạch chân"
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            tooltip="Làm nổi bật"
          >
            <Highlighter size={16} />
          </ToolbarButton>
        </div>

        <Separator />

        {/* Color Group */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
               <Palette size={16} className="text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 grid grid-cols-5 gap-1">
             {["#000000", "#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#64748b"].map(color => (
               <button
                 key={color}
                 className="w-6 h-6 rounded-sm border border-slate-200"
                 style={{ backgroundColor: color }}
                 onClick={() => editor.chain().focus().setColor(color).run()}
               />
             ))}
             <button 
                className="col-span-1 h-6 flex items-center justify-center border border-slate-200 hover:bg-slate-100"
                onClick={() => editor.chain().focus().unsetColor().run()}
             >
                <Eraser size={12} />
             </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator />

        {/* Alignment Group */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            tooltip="Căn trái"
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            tooltip="Căn giữa"
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            tooltip="Căn phải"
          >
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            tooltip="Căn đều"
          >
            <AlignJustify size={16} />
          </ToolbarButton>
        </div>

        <Separator />

        {/* Lists & Tasks Group */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            tooltip="Danh sách dấu chấm"
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            tooltip="Danh sách số"
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            tooltip="Danh sách công việc"
          >
            <CheckSquare size={16} />
          </ToolbarButton>
        </div>

        <Separator />

        {/* Insert Group */}
        <div className="flex items-center">
          <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} tooltip="Liên kết">
            <LinkIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} tooltip="Hình ảnh">
            <ImageIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={addYoutube} tooltip="Video Youtube">
            <YoutubeIcon size={16} />
          </ToolbarButton>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Bảng">
                <TableIcon size={16} className="text-slate-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Chèn bảng</DropdownMenuItem>
              <Separator />
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>Thêm cột trước</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>Thêm cột sau</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>Xóa cột</DropdownMenuItem>
              <Separator />
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>Thêm hàng trên</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>Thêm hàng dưới</DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>Xóa hàng</DropdownMenuItem>
              <Separator />
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} className="text-red-500">Xóa bảng</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        {/* Script & Misc Group */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            tooltip="Chỉ số trên"
          >
            <SuperscriptIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            tooltip="Chỉ số dưới"
          >
            <SubscriptIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            tooltip="Trích dẫn"
          >
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            tooltip="Khối mã"
          >
            <Code size={16} />
          </ToolbarButton>
        </div>
      </div>
      
      <div className="relative min-h-[500px]">
        <EditorContent editor={editor} />
      </div>

      <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 font-bold uppercase">
         <div className="flex gap-4">
            <span>Ký tự: {editor.storage.characterCount?.characters() || editor.getText().length}</span>
            <span>Từ: {editor.storage.characterCount?.words() || editor.getText().split(/\s+/).filter(Boolean).length}</span>
         </div>
         <div>Sài Gòn Valve CMS v2.0</div>
      </div>

      <MediaSelectorDialog 
        open={isMediaSelectorOpen}
        onOpenChange={setIsMediaSelectorOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
