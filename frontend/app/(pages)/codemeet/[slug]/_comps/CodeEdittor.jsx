import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from "@codemirror/lang-html";
import { cpp } from "@codemirror/lang-cpp";
import { keymap } from "@codemirror/view";
import { completionKeymap } from "@codemirror/autocomplete";
import { EditorView, Decoration } from '@codemirror/view';
// import { EditorSelection, EditorState } from '@codemirror/state';


// Custom theme with transparent background and modern styles
const customTheme = EditorView.theme({
 '&': {
    backgroundColor: 'transparent !important', // Pure black background for the entire editor
    borderRadius: '12px',
    padding: '10px',
    border: 'none',
  },
  '.cm-content': {
    backgroundColor: '#000000 !important', // Pure black background for code content
    color: '#e0e0e0', // Slightly brighter text color for better contrast
    caretColor: '#ff6ac1', // Caret color (vibrant pink)
  },
  '.cm-gutters': {
    backgroundColor: '#000000 !important', // Transparent gutter background
    color: '#a1a1a1', // Lighter gray for gutter text
    border: 'none',
  },
  '.cm-cursor': {
    borderLeftColor: '#ff6ac1 !important', // Cursor color (vibrant pink)
  },
  '.cm-activeLine': {
    backgroundColor: '#1a1a1a !important', // Highlight active line with a soft dark gray
  },
  '.cm-tooltip': {
    backgroundColor: '#1e1e1e', // Tooltip background adjusted for black theme
    color: '#e0e0e0', // Brighter tooltip text color
  },
  
  // Adjustments for better visibility in C++ syntax highlighting
  '.cm-keyword': {
    color: '#ff6ac1', // Bright pink for keywords
  },
  '.cm-variable': {
    color: '#ffffff', // White for variable names
  },
  '.cm-variable-2': {
    color: '#ffffff', // White for second-level variables
  },
  '.cm-atom': {
    color: '#79d3f4', // Bright cyan for atomic elements (numbers, booleans)
  },
  '.cm-comment': {
    color: '#5a5a5a', // Dark gray for comments to blend into the background
    fontStyle: 'italic', // Italicize comments for a subtle effect
  },
  '.cm-string': {
    color: '#f3f99d', // Bright yellow-green for strings
  },
  '.cm-number': {
    color: '#b482f7', // Vibrant purple for numbers
  },
  '.cm-function': {
    color: '#50fa7b', // Bright green for function names
  },
  '.cm-tag': {
    color: '#ffa07a', // Coral orange for HTML tags
  },
  '.cm-class': {
    color: '#ffa07a', // Coral orange for class names
  },
  '.cm-type': {
    color: '#ffa07a', // Coral orange for type names
  },
}, { dark: true });




// CodeMirror setup with language support and custom theme
const CodeEditor = ({ Code, onChange, language, isEditable }) => {
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
        EditorView.editable.of(isEditable),
      ]}
      onChange={onChange} // Handle changes in code
      className='border-gray rounded-xl max-h-full !terminal'
    />
  );
};

export default CodeEditor;
