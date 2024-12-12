// components/CodeEditor.js
'use client';

import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';


const customTheme = EditorView.theme({
    '&': {
      backgroundColor: 'rgba(13, 13, 13, 0) !important', // Force transparent background
      borderRadius: '20px',
      padding: '10px',
      border: 'none'
    },
    '.cm-content': {
      backgroundColor: 'rgba(13, 13, 13, 0) !important', // Transparent content background
      color: '#ffffff', // Text color
      caretColor: '#ff79c6', // Caret color
    },
    '.cm-gutters': {
      backgroundColor: 'rgba(0, 0, 0, 0) !important', // Transparent gutter
      color: '#8b949e', // Gutter text color
      border: 'none',
    },
  });

const CodeEditor = ({ Code, onChange }) => {


    return (

        <CodeMirror
            value={Code}
            height="30rem"
            extensions={[javascript(), customTheme]}
            onChange={onChange}
            className='border-0 rounded-xl'
        />

    );
};

export default CodeEditor;
