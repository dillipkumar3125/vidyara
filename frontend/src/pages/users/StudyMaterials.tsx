import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  MoreVertical,
  ChevronDown,
  Hash,
  Upload,
  Download,
  Share2,
  Link2,
  Flag,
  X,
  FileText,
  BookOpen,
  GraduationCap,
  ScrollText,
  Plus,
  CheckCircle2,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllDocuments, uploadDocument, deleteDocument } from '@/services/DocumentService';
import type DocumentResponse from '@/models/DocumentResponse';

interface Material {
  id: string;
  type: string;
  typeColor: string;
  title: string;
  author: string;
  hashtags: string[];
  fileUrl?: string;
}




// Maps filter label → material type(s) to match
const SOURCE_FILTER_MAP: Record<string, string[]> = {
  'All Sources': [],
  'Research Papers': ['Research Paper'],
  'Lecture Notes': ['Lecture Notes'],
  'Study Guides': ['Study Guide'],
  'Thesis Archives': ['Thesis'],
};

const SOURCE_FILTERS = ['All Sources', 'Research Papers', 'Lecture Notes', 'Study Guides', 'Thesis Archives'];


const MATERIAL_TYPES = ['Research Paper', 'Lecture Notes', 'Study Guide', 'Thesis', 'E-Book', 'Assignment'];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'Research Paper': <FileText className="h-4 w-4" />,
  'Lecture Notes': <BookOpen className="h-4 w-4" />,
  'Study Guide': <GraduationCap className="h-4 w-4" />,
  Thesis: <ScrollText className="h-4 w-4" />,
};

// Maps backend DocumentResponse → display Material
function toMaterial(doc: DocumentResponse): Material {
  const typeMap: Record<string, { label: string; color: string }> = {
    'application/pdf': { label: 'Research Paper', color: 'bg-[#FDF1E5] text-[#C97B35]' },
    'application/msword': { label: 'Lecture Notes', color: 'bg-[#EBF4FF] text-[#2B6CB0]' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      label: 'Study Guide', color: 'bg-[#EBF4FF] text-[#2B6CB0]',
    },
    'text/plain': { label: 'Study Guide', color: 'bg-[#EBF4FF] text-[#2B6CB0]' },
  };
  const mapped = typeMap[doc.fileType ?? ''] ?? { label: 'Document', color: 'bg-slate-100 text-slate-600' };
  return {
    id: doc.id,
    type: mapped.label,
    typeColor: mapped.color,
    title: doc.title,
    author: doc.uploadedBy ? `Uploaded by ${doc.uploadedBy}` : 'Unknown Author',
    hashtags: [],
    fileUrl: '#',
  };
}

// ─── Dropdown Menu ───────────────────────────────────────────────────────────
interface DropdownMenuProps {
  materialId: string;
  fileUrl?: string;
  onDelete?: (id: string) => void;
}

function DropdownMenu({ materialId, fileUrl, onDelete }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href + '#material-' + materialId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1500);
  };

  const menuItems = [
    {
      icon: <Download className="h-4 w-4" />,
      label: 'Download',
      action: () => {
        if (fileUrl && fileUrl !== '#') window.open(fileUrl, '_blank');
        setOpen(false);
      },
      color: 'text-slate-700 dark:text-slate-200',
    },
    {
      icon: <Share2 className="h-4 w-4" />,
      label: 'Share',
      action: () => {
        if (navigator.share) {
          navigator.share({ title: 'Study Material', url: window.location.href });
        }
        setOpen(false);
      },
      color: 'text-slate-700 dark:text-slate-200',
    },
    {
      icon: copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />,
      label: copied ? 'Link Copied!' : 'Copy Link',
      action: handleCopyLink,
      color: copied ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-200',
    },
    {
      icon: <Bookmark className="h-4 w-4" />,
      label: 'Save to Bookmarks',
      action: () => setOpen(false),
      color: 'text-slate-700 dark:text-slate-200',
    },
    { divider: true },
    {
      icon: <Flag className="h-4 w-4" />,
      label: 'Report',
      action: () => setOpen(false),
      color: 'text-red-500 dark:text-red-400',
    },
    { divider: true },
    {
      // DELETE /library/documents/{id}
      icon: <Trash2 className="h-4 w-4" />,
      label: 'Delete',
      action: () => {
        onDelete?.(materialId);
        setOpen(false);
      },
      color: 'text-red-600 dark:text-red-500',
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        id={`menu-btn-${materialId}`}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 w-52 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 overflow-hidden"
          >
            {menuItems.map((item, i) =>
              'divider' in item ? (
                <div key={i} className="my-1 border-t border-slate-100 dark:border-slate-800" />
              ) : (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); item.action(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${item.color}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
interface UploadModalProps {
  onClose: () => void;
  onUploaded?: () => void;
}

function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const [form, setForm] = useState({
    title: '',
    type: '',
    author: '',
    institution: '',
    description: '',
    subject: '',
    year: '',
    tags: '',
    file: null as File | null,
  });
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = (file: File | null) => {
    if (file) setForm((f) => ({ ...f, file }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  // POST /library/documents
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file) return;
    setUploading(true);
    setUploadError(null);
    try {
      await uploadDocument(form.file, form.title, form.description);
      setSubmitted(true);
      onUploaded?.();
      setTimeout(onClose, 2000);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Study Material</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Share knowledge with the Vidyara community</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 pb-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Uploaded Successfully!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your material is being reviewed and will be published shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* File Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-[#2B547E] bg-blue-50 dark:bg-blue-900/10'
                    : form.file
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-[#2B547E] hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                {form.file ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">{form.file.name}</span>
                    <span className="text-xs text-slate-500">{(form.file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Drag & drop your file here, or <span className="text-[#2B547E] dark:text-blue-400">browse</span>
                    </p>
                    <p className="text-xs text-slate-400">PDF, DOC, DOCX, PPT, PPTX, TXT • Max 50 MB</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-3.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-2xl">
                  {uploadError}
                </div>
              )}

              {/* Two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Material Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Material Type *</label>
                  <div className="relative">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 pr-10"
                    >
                      <option value="" disabled>Select type</option>
                      {MATERIAL_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject / Domain *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Machine Learning, Physics"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter the full title of the material"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 placeholder:text-slate-400"
                />
              </div>

              {/* Author & Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Author(s) *</label>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Prof. Ravi Kumar"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={form.institution}
                    onChange={handleChange}
                    placeholder="e.g. IIT Bombay"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Publication Year & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publication Year</label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder={String(new Date().getFullYear())}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags / Hashtags</label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="transformers, NLP, deep-learning"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of the material content..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/30 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-[#2B547E] hover:bg-[#1e3f5f] text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Uploading...' : 'Upload Material'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudyMaterials() {
  const [activeSource, setActiveSource] = useState('All Sources');
  const [showUpload, setShowUpload] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // ── API state ─────────────────────────────────────────────────────────
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // GET /library/documents — load on mount
  const fetchMaterials = useCallback(async () => {
    setLoadingMaterials(true);
    setFetchError(null);
    try {
      const docs = await getAllDocuments();
      setMaterials(docs.map(toMaterial));
    } catch {
      setFetchError('Could not load documents from server.');
    } finally {
      setLoadingMaterials(false);
    }
  }, []);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  // DELETE /library/documents/{id}
  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // silently ignore — backend delete is not yet implemented
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allowedTypes = SOURCE_FILTER_MAP[activeSource] ?? [];
  const filteredMaterials =
    allowedTypes.length === 0
      ? materials
      : materials.filter((m) => allowedTypes.includes(m.type));

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 p-4 md:p-8 pt-28 md:pt-32 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Row: Filters + Upload Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {SOURCE_FILTERS.map((source) => (
              <button
                key={source}
                onClick={() => setActiveSource(source)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeSource === source
                    ? 'bg-[#2B547E] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {source}
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <button
            id="upload-material-btn"
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#2B547E] hover:bg-[#1e3f5f] text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            Upload Material
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Refine Search
            </h2>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Publication Date
              </h3>
              <div className="relative">
                <select className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2B547E]/20 cursor-pointer pr-10">
                  <option>Last 12 Months</option>
                  <option>Last 3 Years</option>
                  <option>Last 5 Years</option>
                  <option>All Time</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            {loadingMaterials ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/40">
                <Loader2 className="h-8 w-8 text-[#2B547E] animate-spin" />
                <p className="text-sm font-medium text-slate-500">Loading materials...</p>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/40 px-6">
                <div className="p-3 text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-2xl font-medium text-sm">
                  {fetchError}
                </div>
                <Button onClick={fetchMaterials} variant="outline" className="rounded-full px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-0">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMaterials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    id={`material-${material.id}`}
                    className="h-full border-0 shadow-sm rounded-3xl bg-white dark:bg-slate-900 hover:shadow-md transition-shadow group cursor-pointer"
                  >
                    <CardContent className="p-7">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${material.typeColor}`}>
                          {TYPE_ICONS[material.type] || <FileText className="h-4 w-4" />}
                          {material.type}
                        </span>
                        <div className="flex items-center gap-1">
                          {/* Bookmark */}
                          <button
                            id={`bookmark-${material.id}`}
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(material.id); }}
                            className="p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Bookmark
                              className={`h-4 w-4 transition-colors ${
                                bookmarked.has(material.id)
                                  ? 'fill-[#2B547E] text-[#2B547E]'
                                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                              }`}
                            />
                          </button>
                          {/* 3-dot menu */}
                          <DropdownMenu
                            materialId={material.id}
                            fileUrl={material.fileUrl}
                            onDelete={handleDelete}
                          />
                        </div>
                      </div>

                      <h3 className="text-xl font-medium text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-[#2B547E] transition-colors">
                        {material.title}
                      </h3>

                      <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-3">
                        {material.author}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {material.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2B547E] dark:bg-blue-900/30 dark:text-blue-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Hash className="h-2.5 w-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

                {/* Empty State */}
                {filteredMaterials.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 gap-3 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="h-7 w-7 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No materials found</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Try selecting a different source filter.</p>
                  </motion.div>
                )}
              </>
            )}


            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 rounded-full px-8 py-6 gap-2 font-medium"
              >
                Load More Papers
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={fetchMaterials} />}
      </AnimatePresence>
    </div>
  );
}
