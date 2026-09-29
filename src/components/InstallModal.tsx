import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Terminal,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'ios' | 'desktop' | 'dev'>('mobile');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Detect device for initial tab
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActiveTab('ios');
    } else if (/android/.test(ua)) {
      setActiveTab('mobile');
    } else {
      setActiveTab('desktop');
    }
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          onClose();
        }
      } catch (err) {
        console.error('Error invoking install prompt:', err);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  const handleCopyCode = () => {
    const code = `# 1. Clonar el proyecto
git clone <url-del-repositorio>
cd futboldata-ai

# 2. Instalar dependencias
npm install

# 3. Configurar tu clave de API Gemini en .env
cp .env.example .env
# Edita .env con tu GEMINI_API_KEY="AIzaSy..."

# 4. Iniciar el servidor local
npm run dev`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 text-2xl shadow-lg shadow-emerald-500/20 font-black">
            ⚽
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Instalar FutbolData AI
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold uppercase border border-emerald-500/30">
                PWA
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Instálala en tu dispositivo para acceso directo sin barras del navegador
            </p>
          </div>
        </div>

        {/* 1-Click Install Button if supported by browser */}
        {deferredPrompt && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-400 block">
                Navegador compatible detectado
              </span>
              <p className="text-xs text-slate-300">
                Puedes instalar la aplicación en 1 solo clic en tu dispositivo.
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalling ? 'Instalando...' : 'Instalar Ahora'}</span>
            </button>
          </div>
        )}

        {/* Device Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'mobile'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android</span>
            <span className="sm:hidden">And.</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ios'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>iPhone</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'desktop'
                ? 'bg-slate-800 text-purple-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PC / Mac</span>
            <span className="sm:hidden">PC</span>
          </button>

          <button
            onClick={() => setActiveTab('dev')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'dev'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Local (Dev)</span>
            <span className="sm:hidden">Código</span>
          </button>
        </div>

        {/* Tab Content: Android */}
        {activeTab === 'mobile' && (
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Instalación en Android (Google Chrome / Brave)
            </h4>
            <ol className="space-y-2.5 list-decimal list-inside bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
              <li>
                Abre esta página web desde <strong>Google Chrome</strong> en tu móvil Android.
              </li>
              <li>
                Toca los <strong>tres puntos verticales (⋮)</strong> en la esquina superior derecha del navegador.
              </li>
              <li>
                Selecciona la opción <strong>&quot;Instalar aplicación&quot;</strong> o <strong>&quot;Añadir a la pantalla de inicio&quot;</strong>.
              </li>
              <li>
                Confirma tocando <strong>&quot;Instalar&quot;</strong>. ¡Aparecerá el icono de <em>FutbolData AI</em> como una app nativa en tu teléfono!
              </li>
            </ol>
          </div>
        )}

        {/* Tab Content: iPhone / iPad */}
        {activeTab === 'ios' && (
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Instalación en iPhone / iPad (Safari)
            </h4>
            <ol className="space-y-2.5 list-decimal list-inside bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
              <li>
                Abre esta app en el navegador <strong>Safari</strong> de tu iPhone.
              </li>
              <li>
                Toca el botón <strong>Compartir</strong> (icono de cuadrado con una flecha hacia arriba <span className="font-bold text-cyan-400">⎋</span>) en la barra inferior.
              </li>
              <li>
                Desplázate hacia abajo en el menú y presiona <strong>&quot;Añadir a la pantalla de inicio&quot;</strong> (icono <span className="font-bold text-cyan-400">⊞</span>).
              </li>
              <li>
                Toca <strong>&quot;Añadir&quot;</strong> en la esquina superior derecha. Se abrirá a pantalla completa sin barra de navegación.
              </li>
            </ol>
          </div>
        )}

        {/* Tab Content: Desktop PC / Mac */}
        {activeTab === 'desktop' && (
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Laptop className="w-4 h-4 text-purple-400" />
              Instalación en Computadora (Chrome / Edge / Windows / Mac)
            </h4>
            <ol className="space-y-2.5 list-decimal list-inside bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
              <li>
                En <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>, mira el lado derecho de la barra de direcciones URL.
              </li>
              <li>
                Haz clic en el icono de <strong>Instalar aplicación</strong> (parece una pantalla de ordenador con flecha hacia abajo <span className="font-bold text-purple-400">⤓</span>).
              </li>
              <li>
                Haz clic en <strong>&quot;Instalar&quot;</strong>. La app se abrirá en una ventana independiente y podrás anclarla a la barra de tareas o dock.
              </li>
            </ol>
          </div>
        )}

        {/* Tab Content: Local Dev / Git */}
        {activeTab === 'dev' && (
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                Ejecutar en tu computadora con Node.js
              </h4>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copiado' : 'Copiar comandos'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`# 1. Instalar dependencias
npm install

# 2. Configurar variable de entorno (.env)
GEMINI_API_KEY="TU_API_KEY_DE_GEMINI"

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en tu navegador
# http://localhost:3000`}
            </pre>
            <p className="text-[11px] text-slate-400">
              Requiere <strong>Node.js 18+</strong> y una clave de API gratuita de Google AI Studio.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sin descargas pesadas ni tiendas de aplicaciones</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
