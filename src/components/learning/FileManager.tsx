'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload, File, FileText, Image, FileSpreadsheet, FileVideo,
  Search, Filter, Grid, List, Download, Share2, Trash2, Edit,
  FolderPlus, Plus, MoreVertical, Eye, Star, Archive,
  SortAsc, SortDesc, Calendar, User, HardDrive
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'spreadsheet';
  size: number;
  createdAt: string;
  modifiedAt: string;
  parentId?: string;
  content?: string;
  url?: string;
  thumbnail?: string;
  tags: string[];
  isFavorite: boolean;
  isShared: boolean;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  metadata?: {
    author?: string;
    description?: string;
    extractedText?: string;
    wordCount?: number;
    pageCount?: number;
  };
}

interface FileManagerProps {
  files: FileItem[];
  currentFolder?: string;
  onFileSelect?: (file: FileItem) => void;
  onFileUpload?: (files: File[]) => void;
  onFileDelete?: (fileId: string) => void;
  onFileRename?: (fileId: string, newName: string) => void;
  onFolderCreate?: (name: string, parentId?: string) => void;
  onFileMove?: (fileId: string, targetFolderId: string) => void;
  viewMode?: 'grid' | 'list';
  showUpload?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
}

export default function FileManager({
  files,
  currentFolder = 'root',
  onFileSelect,
  onFileUpload,
  onFileDelete,
  onFileRename,
  onFolderCreate,
  onFileMove,
  viewMode = 'grid',
  showUpload = true,
  showSearch = true,
  showFilters = true
}: FileManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current folder files
  const currentFiles = files.filter(file => file.parentId === currentFolder);

  // Filter and sort files
  const filteredFiles = currentFiles
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || file.type === filterType;
      const matchesFavorites = !showFavorites || file.isFavorite;
      return matchesSearch && matchesType && matchesFavorites;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Drag and drop for file upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (onFileUpload) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'text/*': ['.txt', '.md', '.json'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'audio/*': ['.mp3', '.wav', '.ogg']
    }
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return <FolderPlus className="h-8 w-8 text-blue-500" />;
      case 'document': return <FileText className="h-8 w-8 text-green-500" />;
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'image': return <Image className="h-8 w-8 text-purple-500" />;
      case 'video': return <FileVideo className="h-8 w-8 text-orange-500" />;
      case 'spreadsheet': return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileClick = (file: FileItem) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  const handleBulkAction = (action: 'delete' | 'favorite' | 'share') => {
    // Implement bulk actions
    console.log(`Bulk ${action} for files:`, selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Manager</h2>
          <div className="flex items-center space-x-2">
            {showUpload && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
            )}
            <button
              onClick={() => onFolderCreate?.('New Folder', currentFolder)}
              className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex items-center space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="folder">Folders</option>
                  <option value="document">Documents</option>
                  <option value="image">Images</option>
                  <option value="pdf">PDFs</option>
                  <option value="video">Videos</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Date</option>
                  <option value="size">Sort by Size</option>
                  <option value="type">Sort by Type</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`p-2 border rounded-md transition-colors ${
                    showFavorites
                      ? 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Star className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedFiles.length} file(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('favorite')}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  Favorite
                </button>
                <button
                  onClick={() => handleBulkAction('share')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      <div
        {...getRootProps()}
        className={`flex-1 p-4 overflow-auto ${
          isDragActive ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400' : ''
        }`}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && onFileUpload) {
              onFileUpload(Array.from(e.target.files));
            }
          }}
        />

        {isDragActive && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
                Drop files here to upload
              </p>
            </div>
          </div>
        )}

        {!isDragActive && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`${
                  viewMode === 'grid'
                    ? 'p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer'
                    : 'flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                } ${selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                onClick={() => handleFileClick(file)}
              >
                {viewMode === 'grid' ? (
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {file.type === 'folder' ? `${files.filter(f => f.parentId === file.id).length} items` : formatFileSize(file.size)}
                    </p>
                    {file.isFavorite && (
                      <Star className="h-3 w-3 text-yellow-500 mx-auto mt-1" />
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => handleFileSelect(file.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-3"
                    />
                    <div className="mr-3">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(file.modifiedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {file.type === 'folder' ? `${files.filter(f => f.parentId === file.id).length} items` : formatFileSize(file.size)}
                      </p>
                      {file.isFavorite && (
                        <Star className="h-3 w-3 text-yellow-500 ml-auto mt-1" />
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && !isDragActive && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No files match your search' : 'No files in this folder'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                {showUpload && 'Drag and drop files here or click Upload to get started'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
