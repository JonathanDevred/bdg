import React, { useRef, useState, useEffect } from 'react';
import './styles.scss';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


const TextEditor = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef(null);
  const [selectedFontSize, setSelectedFontSize] = useState('');
  const [textColor, setTextColor] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const [textAlign, setTextAlign] = useState('left');

  const fontSizes = [
    { value: '', label: 'Taille du texte' },
    { value: 'h1', label: 'Titre' },
    { value: 'h2', label: 'Sous-titre' },
    { value: 'h3', label: 'Sous-sous-titre' }
    ];
  const handleFontSizeChange = (event) => {
    const selectedSize = event.target.value;
    setSelectedFontSize(selectedSize);
    document.execCommand('formatBlock', false, selectedSize); 
  };

  const colors = [
    '#000000', '#e6e6e6', '#d3d3d3', '#c0c0c0', '#a9a9a9', '#808080', '#696969', '#333333',
    '#ffcccc', '#ff9999', '#ff6666', '#ff3333', '#cc0000', '#990000', '#ffcc99', '#ff9966',
    '#ff6633', '#ff3300', '#cc3300', '#993300', '#ffcc66', '#ffcc33', '#ffcc00', '#ff9933',
    '#ff9900', '#cc9900', '#999900', '#ccff99', '#ccff66', '#ccff33', '#ccff00', '#99cc00' ];

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

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.addEventListener('change', handleImageUpload);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target.result;
      const imgElement = `<img src="${imgSrc}" alt="Uploaded Image" />`;
      document.execCommand('insertHTML', false, imgElement);
      input.removeEventListener('change', handleImageUpload);
    };
    reader.readAsDataURL(file);
  };


  const handleQuoteClick = () => {
    document.execCommand('formatBlock', false, 'blockquote');
  };

  const handleVideoClick = () => {
    const videoId = window.prompt('Entrez l\'ID de la vidéo YouTube :');
    if (videoId) {
      const videoUrl = `https://www.youtube.com/embed/${videoId}`;
      const iframeCode = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
      document.execCommand('insertHTML', false, iframeCode);
    }
  };

  useEffect(() => {
    const handleEditorClick = (event) => {
      const targetElement = event.target;
      if (targetElement.tagName === 'IMG' && targetElement.dataset.videoId) {
        const videoId = targetElement.dataset.videoId;
        const videoUrl = `https://www.youtube.com/embed/${videoId}`;
        const iframeCode = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
        targetElement.parentNode.outerHTML = iframeCode;
      }
    };

    editorRef.current.addEventListener('click', handleEditorClick);

    return () => {
      editorRef.current.removeEventListener('click', handleEditorClick);
    };
  }, []);

  const handleAlignClick = (alignment) => {
    setTextAlign(alignment);
    document.execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1), false, null);
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker); 
  };

  const handleEmojiSelect = (emoji) => {
    const emojiElement = document.createElement('span');
    emojiElement.innerHTML = emoji.native;
    document.execCommand('insertHTML', false, emojiElement.outerHTML);
    setShowEmojiPicker(false); 
  };

  return (
    <div className="text-editor">
      <div className="toolbar">
        <select value={selectedFontSize} onChange={handleFontSizeChange}>
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>
        <button className={isBold ? 'bold active' : 'bold'} onClick={handleBoldClick}>
          Gras
        </button>
        <button className={isItalic ? 'italic active' : 'italic'} onClick={handleItalicClick}>
          Italique
        </button>
        <button className="underline" onClick={handleUnderlineClick}>
          Souligner
        </button>
        <button className="quote" onClick={handleQuoteClick}>
          Citer
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
        <button className="image" onClick={handleImageClick}>
          Insérer une image
        </button>
        <button className="video" onClick={handleVideoClick}>
          Insérer une vidéo (Youtube)
        </button>

        <button
          className={`align ${textAlign === 'left' ? 'active' : ''}`}
          onClick={() => handleAlignClick('left')}
        >
          Aligner le texte à gauche
        </button>
        <button
          className={`align ${textAlign === 'center' ? 'active' : ''}`}
          onClick={() => handleAlignClick('center')}
        >
          Aligner le texte au centre
        </button>
        <button
          className={`align ${textAlign === 'right' ? 'active' : ''}`}
          onClick={() => handleAlignClick('right')}
        >
          Aligner le texte à droite
        </button>
        <button className="emoji" onClick={handleEmojiClick}>
          Emoji
        </button>
      </div>
      {showEmojiPicker && (
        <div className="emoji-picker">
          <Picker 
          data={data} 
          emojiVersion="14"
          locale="fr"
          theme="dark"
          previewPosition="none" 
          onEmojiSelect={handleEmojiSelect } 
          />
        </div> )}
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
