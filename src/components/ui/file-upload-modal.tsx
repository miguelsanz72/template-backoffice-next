'use client';

import type React from 'react';

import { useState, useRef } from 'react';

interface FileUploadModalProps {
  onClose: () => void;
  onUpload: (files: File[]) => void;
  title?: string;
  allowedTypes?: string[];
  allowedExtensions?: string;
  maxSize?: number;
  multiple?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

export const FileUploadModal = ({
  onClose,
  onUpload,
  title = 'Adjuntar archivo',
  allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  allowedExtensions = '.pdf,.docx,.png,.jpg,.jpeg,.xlsx',
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  multiple = false,
  submitButtonText = 'Adjuntar archivo',
  cancelButtonText = 'Cancelar',
}: FileUploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      setError(`Tipo de archivo no permitido. Por favor, sube un archivo en formato válido.`);
      return false;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. El tamaño máximo permitido es ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);

      if (!multiple && droppedFiles.length > 1) {
        setError('Solo puedes subir un archivo a la vez.');
        return;
      }

      const validFiles = droppedFiles.filter(validateFile);

      if (validFiles.length > 0) {
        setFiles(multiple ? [...files, ...validFiles] : [validFiles[0]]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      if (!multiple && selectedFiles.length > 1) {
        setError('Solo puedes subir un archivo a la vez.');
        return;
      }

      const validFiles = selectedFiles.filter(validateFile);

      if (validFiles.length > 0) {
        setFiles(multiple ? [...files, ...validFiles] : [validFiles[0]]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      setError('Por favor, selecciona al menos un archivo.');
      return;
    }

    // Enviamos los archivos al componente padre
    onUpload(files);

    // Cerramos el modal
    onClose();
  };

  // Formatear tamaño del archivo para mostrar
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Área de arrastrar y soltar */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-upload mx-auto mb-2 text-gray-400"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>

            <p className="text-gray-600 mb-1">
              Arrastra y suelta {multiple ? 'tus archivos' : 'tu archivo'} aquí o{' '}
              <span className="text-blue-600 font-medium">haz clic para explorar</span>
            </p>
            <p className="text-xs text-gray-500">
              {allowedExtensions.replace(/\./g, '').toUpperCase().split(',').join(', ')} (máx. {(maxSize / (1024 * 1024)).toFixed(0)}MB)
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={allowedExtensions}
              className="hidden"
              multiple={multiple}
            />
          </div>

          {/* Mostrar archivos seleccionados */}
          {files.length > 0 && (
            <div className="mb-4 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="mb-2 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file text-blue-600"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    aria-label="Eliminar archivo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje de error */}
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              {cancelButtonText}
            </button>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0}
              className={`px-4 py-2 rounded-md text-white ${
                files.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
