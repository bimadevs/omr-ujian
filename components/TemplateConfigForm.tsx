'use client';

import { useState, useCallback } from 'react';
import { BoxCoordinates } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

interface TemplateConfigFormProps {
  imageUrl: string | null;
  coordinates: BoxCoordinates[];
  onChange: (coords: BoxCoordinates[]) => void;
}

export default function TemplateConfigForm({ imageUrl, coordinates, onChange }: TemplateConfigFormProps) {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const addBox = useCallback(() => {
    const newBox: BoxCoordinates = {
      id: Date.now(),
      x: 50,
      y: 50,
      width: 40,
      height: 40,
      label: `Box ${coordinates.length + 1}`,
    };
    onChange([...coordinates, newBox]);
  }, [coordinates, onChange]);

  const removeBox = useCallback(
    (id: number) => {
      onChange(coordinates.filter((c) => c.id !== id));
      if (selectedBox === id) setSelectedBox(null);
    },
    [coordinates, onChange, selectedBox]
  );

  const updateBox = useCallback(
    (id: number, field: keyof BoxCoordinates, value: number | string) => {
      onChange(
        coordinates.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    },
    [coordinates, onChange]
  );

  const getBoxStyle = (box: BoxCoordinates) => ({
    left: `${box.x}%`,
    top: `${box.y}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  });

  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img src={imageUrl} alt="Template" className="w-full h-full object-contain" />
          {coordinates.map((box) => (
            <div
              key={box.id}
              className={`absolute border-2 rounded transition-colors cursor-pointer ${
                selectedBox === box.id ? 'border-blue-500 bg-blue-500/20' : 'border-green-500/70 bg-green-500/10'
              }`}
              style={getBoxStyle(box)}
              onClick={() => setSelectedBox(box.id)}
              title={box.label}
            >
              <span className="absolute -top-5 left-0 text-[10px] font-medium text-green-700 bg-white/80 px-1 rounded whitespace-nowrap">
                {box.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900">Koordinat Kotak ({coordinates.length})</h3>
        <button
          onClick={addBox}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Kotak
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {coordinates.map((box) => (
          <div
            key={box.id}
            className={`grid grid-cols-6 gap-2 p-3 rounded-lg border text-sm transition-colors ${
              selectedBox === box.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
            onClick={() => setSelectedBox(box.id)}
          >
            <div className="col-span-6">
              <input
                type="text"
                value={box.label}
                onChange={(e) => updateBox(box.id, 'label', e.target.value)}
                className="w-full px-2 py-1 border border-gray-200 rounded text-sm font-medium"
                placeholder="Label"
              />
            </div>
            {(['x', 'y', 'width', 'height'] as const).map((field) => (
              <div key={field} className="col-span-1">
                <label className="text-[10px] uppercase text-slate-500 font-medium">{field}</label>
                <input
                  type="number"
                  min={0}
                  max={field === 'x' || field === 'y' ? 100 : 50}
                  value={box[field]}
                  onChange={(e) => updateBox(box.id, field, Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
            ))}
            <div className="col-span-1 flex items-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBox(box.id);
                }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
