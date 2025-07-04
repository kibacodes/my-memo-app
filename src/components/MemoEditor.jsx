import React from 'react';

export default function MemoEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  selectedMemo,
}) {
  return (
    <div className="memo-editor">
      <input
        id="memo-title"
        type="text"
        value={title}
        disabled={!selectedMemo}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <textarea
        id="memo-content"
        value={content}
        disabled={!selectedMemo}
        onChange={(e) => onContentChange(e.target.value)}
      />
      <button id="save-memo" disabled={!selectedMemo} onClick={onSave}>
        SAVE
      </button>
      {selectedMemo && (
        <button id="delete-memo" onClick={onDelete}>
          DELETE
        </button>
      )}
    </div>
  );
}
