import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { generateSampleMatchCard } from '../utils/sampleImages';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeCapture: (base64: string, notes?: string) => Promise<void>;
  isLoading: boolean;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeCapture,
  isLoading,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              processFile(blob);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setBase64Data(result);
    };
    reader.onerror = () => {
      setErrorMsg('Error al leer la imagen.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSample = () => {
    const sample = generateSampleMatchCard('Real Madrid', 'Bayern Múnich');
    setPreviewUrl(sample);
    setBase64Data(sample);
    setNotes('Captura estadística de semifinal europea con cuotas');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Data) {
      setErrorMsg('Por favor sube o pega una imagen primero.');
      return;
    }
    try {
      await onAnalyzeCapture(base64Data, notes);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al analizar la captura.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                Analizar Captura con Visión IA
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Multimodal 2026
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sube estadísticas de Sofascore, FlashScore, boleto de apuestas o cuotas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload / Dropzone area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-emerald-500 bg-emerald-500/10'
                : previewUrl
                ? 'border-slate-700 bg-slate-950/60'
                : 'border-slate-700 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-950/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />

            {previewUrl ? (
              <div className="space-y-3">
                <div className="relative max-h-56 mx-auto rounded-lg overflow-hidden border border-slate-700 shadow-md">
                  <img
                    src={previewUrl}
                    alt="Previsualización de captura"
                    className="w-full h-auto object-contain max-h-56 mx-auto"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-900/90 text-xs font-medium text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Imagen lista
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Haz clic para cambiar la imagen o arrastra otra aquí (también puedes presionar <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">Ctrl+V</kbd> para pegar).
                </p>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-emerald-400 border border-slate-700">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Arrastra y suelta tu captura aquí o <span className="text-emerald-400 underline underline-offset-2">selecciona un archivo</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Capturas de cuotas, alineaciones, tabla de córners, tiros o xG (PNG, JPG, WebP)
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                  <span>💡 Tip: Puedes presionar</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-emerald-300 font-mono font-bold text-[11px]">
                    Ctrl + V
                  </kbd>
                  <span>para pegar directamente</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick preset button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">¿No tienes una captura a mano?</span>
            <button
              type="button"
              onClick={handleSample}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Probar con captura de muestra
            </button>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Notas o contexto adicional (Opcional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Es el partido de vuelta de Champions, o cuotas de Bet365..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !base64Data}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
                isLoading || !base64Data
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ANALIZANDO CAPTURA CON IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  ANALIZAR CAPTURA CON BIG DATA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
