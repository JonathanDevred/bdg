import React, { useRef, useState } from 'react';
import './styles.scss';

const TextEditor = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef(null);
  const [textColor, setTextColor] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#c0c0c0', '#808080',
    '#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff', '#ffcc99', '#ccff99',
    '#99ccff', '#ffccff', '#ccffff', '#cccc99', '#cc99cc', '#99cccc', '#ff6666', '#66ff66',
    '#6666ff', '#ffff66', '#ff66ff', '#66ffff', '#ff9933', '#99ff33', '#3399ff', '#ccffcc'  ];

  const handleChange = (value) => {
    setContent(value);
    onContentChange(value); // Appeler la fonction onContentChange pour mettre à jour le contenu dans le composant parent
  };

  const handleBoldClick = () => {
    document.execCommand('bold', false, null);
  };

  const handleItalicClick = () => {
    setIsItalic((prevIsItalic) => !prevIsItalic);
    document.execCommand('italic', false, null);
  };

  const handleUnderlineClick = () => {
    document.execCommand('underline', false, null);
  };

  const handleColorChange = (color) => {
    setTextColor(color);
    document.execCommand('foreColor', false, color);
    setShowColorPicker(false);
  };

  return (
    <div className="text-editor">
      <div className="toolbar">
        <button className={isBold ? 'bold active' : 'bold'} onClick={handleBoldClick}>
          Gras
        </button>
        <button className={isItalic ? 'italic active' : 'italic'} onClick={handleItalicClick}>
          Italique
        </button>
        <button className="underline" onClick={handleUnderlineClick}>
          Souligner
        </button>
        <div className="color-picker-container">
          <button
            className="color-picker-btn"
            style={{ backgroundColor: textColor }}
            onClick={() => setShowColorPicker((prev) => !prev)}
          />
          {showColorPicker && (
            <div className="color-picker">
              {colors.map((color) => (
                <button
                  key={color}
                  className="color-btn"
                  style={{
                    backgroundColor: color,
                    borderColor: color === textColor ? 'white' : color,
                  }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className="editor"
        contentEditable
        ref={editorRef}
        onInput={(event) => handleChange(event.target.innerHTML)}
      />
    </div>
  );
};

export default TextEditor;
