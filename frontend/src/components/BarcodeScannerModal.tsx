import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, ScanLine, AlertCircle, RefreshCw } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
  title?: string;
  description?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  title = 'Scan Barcode or QR Code',
  description = 'Align the SKU barcode or packaging QR code within the scanning frame.',
}) => {
  const [manualSku, setManualSku] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'stocksense-barcode-reader';

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const initializeCamera = async () => {
      try {
        setCameraError(null);
        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        if (devices && devices.length > 0) {
          setCameras(devices);
          const backCamera = devices.find((d) =>
            d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear') || d.label.toLowerCase().includes('environment')
          );
          const initialCamId = backCamera ? backCamera.id : devices[0].id;
          setSelectedCameraId(initialCamId);
          startScanner(initialCamId);
        } else {
          setCameraError('No camera devices detected on this system.');
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Camera access permission denied or unavailable.';
        setCameraError(msg);
      }
    };

    initializeCamera();

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async (cameraId: string) => {
    try {
      await stopScanner();
      const html5QrCode = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        cameraId,
        {
          fps: 15,
          qrbox: { width: 260, height: 180 },
          aspectRatio: 1.333,
        },
        (decodedText) => {
          handleSuccessfulScan(decodedText);
        },
        () => {
          // Continuous frame scan ignore
        }
      );
      setIsScanning(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to launch camera viewport.';
      setCameraError(msg);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {
        // ignore
      }
    }
    html5QrCodeRef.current = null;
    setIsScanning(false);
  };

  const handleSuccessfulScan = (code: string) => {
    stopScanner();
    onScan(code.trim());
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualSku.trim()) {
      handleSuccessfulScan(manualSku.trim());
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
    startScanner(newId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="p-5 flex flex-col items-center">
          {cameraError ? (
            <div className="w-full p-4 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold">Camera Access Unavailable</p>
                <p>{cameraError}</p>
                <p className="text-slate-500 dark:text-slate-400">You can still type the barcode/SKU manually below.</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-4/3 max-w-[320px] bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              <div id={scannerContainerId} className="w-full h-full" />
              
              {/* Animated Crosshair Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  <div className="relative w-48 h-32 border-2 border-indigo-400/80 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-indigo-400 -mt-1 -ml-1" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-indigo-400 -mt-1 -mr-1" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-indigo-400 -mb-1 -ml-1" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-indigo-400 -mb-1 -mr-1" />
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
                  </div>
                  <span className="mt-3 text-[11px] font-medium tracking-wide text-white/80 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                    Scanning for Code 128 / QR / EAN...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Camera Selection Switcher */}
          {cameras.length > 1 && (
            <div className="w-full mt-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCameraId}
                onChange={handleCameraChange}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label || `Camera ${c.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manual Input Fallback */}
          <div className="w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Manual Barcode / SKU Entry:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SKU-ELEC-001"
                  value={manualSku}
                  onChange={(e) => setManualSku(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!manualSku.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ScanLine className="w-4 h-4" />
                  Select
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
