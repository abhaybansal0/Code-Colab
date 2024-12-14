import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from "@codemirror/lang-html";
import { cpp } from "@codemirror/lang-cpp";
import { keymap } from "@codemirror/view";
import { completionKeymap } from "@codemirror/autocomplete";
import { EditorView } from '@codemirror/view';

// Custom theme with transparent background and modern styles
const customTheme = EditorView.theme({
  '&': {
    backgroundColor: '#0d0d0d !important', // Dark background for the entire editor
    borderRadius: '12px',
    padding: '10px',
    border: 'none',
  },
  '.cm-content': {
    backgroundColor: '#0d0d0d !important', // Dark background for code content
    color: '#d4d4d4', // Light text color for code
    caretColor: '#ff79c6', // Caret color (pinkish)
  },
  '.cm-gutters': {
    backgroundColor: 'transparent !important', // Darker gutter background
    color: '#8b949e', // Gutter text color
    border: 'none',
  },
  '.cm-cursor': {
    borderLeftColor: '#ff79c6 !important', // Cursor color (pinkish)
  },
  '.cm-activeLine': {
    backgroundColor: '#2c2c2c !important', // Highlight active line with subtle color
  },
  '.cm-tooltip': {
    backgroundColor: '#2d2d2d', // Tooltip background
    color: '#d4d4d4', // Tooltip text color
  },
  
  // Adjustments for better visibility in C++ syntax highlighting
  '.cm-keyword': {
    color: '#ff79c6', // Keywords in bright pinkish color for contrast
  },
  '.cm-variable': {
    color: '#f8f8f2', // Light color for variable names
  },
  '.cm-variable-2': {
    color: '#f8f8f2', // Light color for second-level variables
  },
  '.cm-atom': {
    color: '#8be9fd', // Light cyan for atomic elements (numbers, booleans)
  },
  '.cm-comment': {
    color: '#6272a4', // Darker blue for comments to stand out but not clash
    fontStyle: 'italic', // Italicize comments for a subtle effect
  },
  '.cm-string': {
    color: '#f1fa8c', // Light yellow for strings for better contrast
  },
  '.cm-number': {
    color: '#bd93f9', // Light purple for numbers
  },
  '.cm-function': {
    color: '#50fa7b', // Green for function names to make them pop
  },
  '.cm-tag': {
    color: '#ffb86c', // Orange for HTML tags
  },
  '.cm-class': {
    color: '#ffb86c', // Orange for class names
  },
  '.cm-type': {
    color: '#ffb86c', // Orange for type names
  },
}, { dark: true });




// CodeMirror setup with language support and custom theme
const CodeEditor = ({ Code, onChange, language }) => {
  let languageExtension;

  // Dynamically choose language extension
  if (language === 'javascript') {
    languageExtension = javascript();
  } else if (language === 'html') {
    languageExtension = html();
  } else {
    languageExtension = cpp();
  }

  return (
    <CodeMirror
      value={Code}
      height="32rem"
      extensions={[
        languageExtension,                      // Enable the selected language support
        customTheme,                            // Apply custom theme
        keymap.of(completionKeymap),         // Autocomplete support
      ]}
      onChange={onChange} // Handle changes in code
      className='border-gray rounded-xl max-h-full'
    />
  );
};

export default CodeEditor;
