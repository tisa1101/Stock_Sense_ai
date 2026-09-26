import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Download, X, CheckCircle2, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { importProductsFile, importOpeningStockFile, downloadProductTemplate, downloadOpeningStockTemplate } from '../services/api';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'products' | 'opening-stock';
}

interface ImportError {
  rowNumber: number;
  sku: string;
  field: string;
  errorMessage: string;
}

interface ImportResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  importedItems: string[];
  errors: ImportError[];
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  type,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProducts = type === 'products';
  const title = isProducts ? 'Bulk Import Product Catalog' : 'Bulk Import Opening Stock';
  const subtitle = isProducts
    ? 'Upload CSV or Excel spreadsheets to batch-create SKU items and categories.'
    : 'Upload CSV or Excel to initialize warehouse stock levels with immutable ledger records.';

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMessage('Please upload a valid .csv or .xlsx spreadsheet file.');
      setSelectedFile(null);
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
    setResult(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = isProducts ? await downloadProductTemplate() : await downloadOpeningStockTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', isProducts ? 'StockSense_Products_Template.csv' : 'StockSense_Opening_Stock_Template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setErrorMessage('Failed to download template.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = isProducts
        ? await importProductsFile(formData)
        : await importOpeningStockFile(formData);

      setResult(response.data.data as ImportResult);
      if (response.data.data.successCount > 0) {
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during bulk import.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={resetModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Template Download Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Need the standard spreadsheet format?
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template (.csv)
            </button>
          </div>

          {/* Drag & Drop Upload Zone */}
          {!result && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-500/70 bg-emerald-50/30 dark:bg-emerald-950/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/30 dark:bg-slate-800/20'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, .xlsx, .xls"
                className="hidden"
              />

              <div className="flex flex-col items-center gap-3">
                <div className={`p-4 rounded-2xl ${selectedFile ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'}`}>
                  {selectedFile ? <FileSpreadsheet className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB — Click or drop another file to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Drop your CSV or Excel file here, or <span className="text-indigo-600 dark:text-indigo-400 font-bold">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supports .csv, .xlsx, .xls</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-400 text-xs">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Import Result Screen */}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{result.totalRows}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Total Rows</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-center">
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{result.successCount}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Imported</div>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-center">
                  <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{result.failedCount}</div>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Errors</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="border border-rose-200 dark:border-rose-900/60 rounded-xl overflow-hidden">
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-xs font-bold text-rose-800 dark:text-rose-300">
                    Row-Level Import Errors ({result.errors.length}):
                  </div>
                  <div className="max-h-40 overflow-y-auto divide-y divide-rose-100 dark:divide-rose-900/30 bg-white dark:bg-slate-900">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="p-2.5 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-rose-600 dark:text-rose-400">Row #{err.rowNumber} ({err.field})</span>
                        <span className="text-slate-500 dark:text-slate-400">{err.errorMessage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.successCount > 0 && result.importedItems.length > 0 && (
                <div className="border border-emerald-200 dark:border-emerald-900/60 rounded-xl overflow-hidden">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Successfully Processed ({result.importedItems.length}):
                  </div>
                  <div className="max-h-32 overflow-y-auto divide-y divide-emerald-50 dark:divide-emerald-900/20 bg-white dark:bg-slate-900 p-2 text-xs text-slate-600 dark:text-slate-400">
                    {result.importedItems.slice(0, 10).map((item, idx) => (
                      <div key={idx} className="py-1 px-2">{item}</div>
                    ))}
                    {result.importedItems.length > 10 && (
                      <div className="py-1 px-2 text-[11px] text-slate-400 italic">...and {result.importedItems.length - 10} more items</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          {result ? (
            <button
              onClick={resetModal}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={resetModal}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedFile || isLoading}
                onClick={handleUpload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Upload & Process
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
