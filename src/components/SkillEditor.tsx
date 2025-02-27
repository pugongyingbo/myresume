import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import styled from 'styled-components'

const MenuBar = styled.div`
  padding: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ active?: boolean }>`
  padding: 4px 8px;
  background: ${props => props.active ? '#eee' : 'transparent'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const EditorContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  
  .ProseMirror {
    padding: 16px;
    min-height: 200px;
    outline: none;
    
    p {
      margin: 0 0 8px 0;
    }
  }
`;

interface SkillEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const SkillEditor = ({ content, onChange }: SkillEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContainer>
      <MenuBar>
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          title="撤销"
        >
          ↩
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          title="重做"
        >
          ↪
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="加粗"
        >
          B
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="斜体"
        >
          I
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="无序列表"
        >
          •
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="有序列表"
        >
          1.
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="左对齐"
        >
          ⇤
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="居中"
        >
          ⇔
        </Button>
      </MenuBar>
      <EditorContent editor={editor} />
    </EditorContainer>
  );
};

export default SkillEditor;