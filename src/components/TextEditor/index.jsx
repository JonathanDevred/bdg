import React, { useRef, useState, useEffect } from 'react';
import './styles.scss';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import pica from 'pica';


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
    { value: 'h3', label: 'Sous-sous-titre' },
    { value: 'p', label: 'Paragraphe' }
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
    onContentChange(value);
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
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', handleImageUpload);
    input.click();
  };

  const resizeImage = async (imageUrl, maxWidth, maxHeight) => {
    const img = new Image();
    img.src = imageUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const width = img.width;
    const height = img.height;

    if (width > maxWidth || height > maxHeight) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
      const newWidth = width * scaleFactor;
      const newHeight = height * scaleFactor;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Utilisation de pica pour redimensionner l'image
      await pica().resize(img, canvas);

      // Conversion du canvas en URL de données
      const resizedImageUrl = canvas.toDataURL('image/jpeg');
      return resizedImageUrl;
    }

    return imageUrl;
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target.result;
      const truncatedAltText = truncateText('Uploaded Image', 20); // Limite le texte à 20 caractères
      const imageElement = `<img src="${imageUrl}" alt="${truncatedAltText}" />`;
      document.execCommand('insertHTML', false, imageElement);
    };
    reader.readAsDataURL(file);
  };


  // Fonction pour extraire l'ID de la vidéo YouTube à partir de l'URL complète
const extractVideoIdFromUrl = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};


  const handleVideoClick = () => {
    const videoUrl = window.prompt('Entrez l\'URL de la vidéo YouTube :');
    if (videoUrl) {
      const videoId = extractVideoIdFromUrl(videoUrl);
      if (videoId) {
        const videoPreview = `<img src="https://img.youtube.com/vi/${videoId}/0.jpg" alt="Video Preview" data-video-url="${videoUrl}" />`;
        document.execCommand('insertHTML', false, videoPreview);
      } else {
        window.alert('URL de vidéo YouTube invalide. Assurez-vous que l\'URL est correcte.');
      }
    }
  };
  
  

  useEffect(() => {
    const handleEditorClick = (event) => {
      const targetElement = event.target;
      if (targetElement.tagName === 'IMG' && targetElement.dataset.videoUrl) {
        const videoUrl = targetElement.dataset.videoUrl;
        const videoId = extractVideoIdFromUrl(videoUrl);
        if (videoId) {
          const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
          const iframeCode = `<iframe width="560" height="315" src="${videoEmbedUrl}" frameborder="0" allowfullscreen></iframe>`;
          targetElement.insertAdjacentHTML('afterend', iframeCode);
          targetElement.remove();
        } else {
          window.alert('URL de vidéo YouTube invalide. Assurez-vous que l\'URL est correcte.');
        }
      }
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
        <button className="image" onClick={handleImageClick}>
          Insérer une image
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
