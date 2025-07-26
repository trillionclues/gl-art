import React from 'react';
import { Settings, Download, Play, Pause } from 'lucide-react';
import { ConversionOptions } from '../types';

interface ControlPanelProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
  onExport: () => void;
  isProcessing: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  onOptionsChange,
  onExport,
  isProcessing
}) => {
  const updateOption = <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-white">Conversion Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Width (characters)
          </label>
          <input
            type="range"
            min="20"
            max="200"
            value={options.width}
            onChange={(e) => updateOption('width', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-sm text-gray-400 mt-1">{options.width}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Height (characters)
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={options.height}
            onChange={(e) => updateOption('height', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-sm text-gray-400 mt-1">{options.height}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contrast
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={options.contrast}
            onChange={(e) => updateOption('contrast', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-sm text-gray-400 mt-1">{options.contrast.toFixed(1)}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Brightness
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={options.brightness}
            onChange={(e) => updateOption('brightness', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-sm text-gray-400 mt-1">{options.brightness.toFixed(1)}</div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={onExport}
          disabled={isProcessing}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};