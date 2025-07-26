import React from 'react';
import { ConversionStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ConversionStyle;
  onStyleChange: (style: ConversionStyle) => void;
}

const styleInfo = {
  ascii: {
    name: 'ASCII',
    description: 'Classic text art using standard ASCII characters',
    preview: '@#%*+=-:. ',
    color: 'from-green-400 to-green-600'
  },
  ansi: {
    name: 'ANSI',
    description: 'Colorized terminal output with ANSI escape codes',
    preview: '█▓▒░ ',
    color: 'from-orange-400 to-red-500'
  },
  bbs: {
    name: 'BBS',
    description: 'Bulletin Board System style with extended characters',
    preview: '█▬▫▪•∙·',
    color: 'from-purple-400 to-purple-600'
  },
  mosaic: {
    name: 'Mosaic',
    description: 'Block-based mosaic using half-height characters',
    preview: '█▄▀ ',
    color: 'from-pink-400 to-pink-600'
  }
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(styleInfo).map(([key, info]) => {
        const style = key as ConversionStyle;
        const isSelected = selectedStyle === style;
        
        return (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-300 text-left
              ${isSelected 
                ? 'border-transparent bg-gradient-to-br ' + info.color + ' text-white shadow-lg transform scale-105'
                : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-750 text-gray-200'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{info.name}</h3>
              <span className="font-mono text-sm opacity-75">{info.preview}</span>
            </div>
            <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
              {info.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};