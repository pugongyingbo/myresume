import { useState } from 'react';
import styled from 'styled-components';

const EditableContainer = styled.div`
  position: relative;
`;

const EditButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 4px 8px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const EditableContent = styled.div`
  min-height: 50px;
  padding: 10px;
`;

interface EditableModuleProps {
  id: string;
  title: string;
  initialContent?: string;
  onSave: (id: string, content: string) => void;
}

const EditableModule = ({ id, title, initialContent = '', onSave }: EditableModuleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    setIsEditing(false);
    onSave(id, content);
  };

  return (
    <EditableContainer>
      <h2>{title}</h2>
      {isEditing ? (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', minHeight: '100px' }}
          />
          <EditButton onClick={handleSave}>保存</EditButton>
        </>
      ) : (
        <>
          <EditableContent>{content || '点击编辑添加内容'}</EditableContent>
          <EditButton onClick={() => setIsEditing(true)}>编辑</EditButton>
        </>
      )}
    </EditableContainer>
  );
};

export default EditableModule;