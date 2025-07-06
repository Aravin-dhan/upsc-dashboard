'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Plus, Heart, Share2, Download, ExternalLink, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: 'motivation' | 'success' | 'perseverance' | 'wisdom' | 'upsc';
  imageUrl?: string;
  backgroundColor: string;
  textColor: string;
  isCustom: boolean;
  isFavorite: boolean;
  createdAt: string;
}

interface PinterestPin {
  url: string;
  description: string;
  imageUrl: string;
}

export default function MotivationalPoster() {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(null);
  const [customQuotes, setCustomQuotes] = useState<MotivationalQuote[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pinterestPins, setPinterestPins] = useState<PinterestPin[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuotes = localStorage.getItem('upsc-motivational-quotes');
      const savedPins = localStorage.getItem('upsc-pinterest-pins');
      
      if (savedQuotes) {
        try {
          setCustomQuotes(JSON.parse(savedQuotes));
        } catch (error) {
          console.error('Error loading quotes:', error);
        }
      }
      
      if (savedPins) {
        try {
          setPinterestPins(JSON.parse(savedPins));
        } catch (error) {
          console.error('Error loading Pinterest pins:', error);
        }
      }
      
      setIsLoaded(true);
      generateRandomQuote();
    }
  }, []);

  const defaultQuotes: MotivationalQuote[] = [
    {
      id: '1',
      text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      author: 'Winston Churchill',
      category: 'perseverance',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      isCustom: false,
      isFavorite: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      category: 'motivation',
      backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#ffffff',
      isCustom: false,
      isFavorite: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      text: 'UPSC is not just an exam, it\'s a journey of self-discovery and nation-building.',
      author: 'Anonymous',
      category: 'upsc',
      backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      textColor: '#ffffff',
      isCustom: false,
      isFavorite: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      text: 'Dream big, work hard, stay focused, and surround yourself with good people.',
      author: 'Unknown',
      category: 'success',
      backgroundColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      textColor: '#ffffff',
      isCustom: false,
      isFavorite: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      text: 'The expert in anything was once a beginner.',
      author: 'Helen Hayes',
      category: 'wisdom',
      backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      textColor: '#ffffff',
      isCustom: false,
      isFavorite: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      text: 'Every UPSC aspirant is a future leader. Your preparation today shapes India\'s tomorrow.',
      author: 'UPSC Mentor',
      category: 'upsc',
      backgroundColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      textColor: '#2d3748',
      isCustom: false,
      isFavorite: false,
      createdAt: new Date().toISOString()
    }
  ];

  const generateRandomQuote = () => {
    const allQuotes = [...defaultQuotes, ...customQuotes];
    if (allQuotes.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setCurrentQuote(allQuotes[randomIndex]);
  };

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-motivational-quotes', JSON.stringify(customQuotes));
      localStorage.setItem('upsc-pinterest-pins', JSON.stringify(pinterestPins));
    }
  };

  const addCustomQuote = (quoteData: Omit<MotivationalQuote, 'id' | 'isCustom' | 'isFavorite' | 'createdAt'>) => {
    const newQuote: MotivationalQuote = {
      ...quoteData,
      id: Date.now().toString(),
      isCustom: true,
      isFavorite: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedQuotes = [...customQuotes, newQuote];
    setCustomQuotes(updatedQuotes);
    saveData();
    setShowAddForm(false);
    toast.success('Custom quote added successfully!');
  };

  const addPinterestPin = (pinData: PinterestPin) => {
    const updatedPins = [...pinterestPins, pinData];
    setPinterestPins(updatedPins);
    saveData();
    toast.success('Pinterest pin added successfully!');
  };

  const toggleFavorite = () => {
    if (!currentQuote) return;
    
    if (currentQuote.isCustom) {
      const updatedQuotes = customQuotes.map(quote =>
        quote.id === currentQuote.id ? { ...quote, isFavorite: !quote.isFavorite } : quote
      );
      setCustomQuotes(updatedQuotes);
      setCurrentQuote({ ...currentQuote, isFavorite: !currentQuote.isFavorite });
      saveData();
    }
    
    toast.success(currentQuote.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const shareQuote = async () => {
    if (!currentQuote) return;
    
    const shareText = `"${currentQuote.text}" - ${currentQuote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Motivational Quote',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success('Quote copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Quote copied to clipboard!');
    }
  };

  const downloadPoster = () => {
    if (!currentQuote) return;
    
    // Create a canvas to generate the poster
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = currentQuote.textColor;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    // Wrap text
    const words = currentQuote.text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 100 && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    // Draw text lines
    const lineHeight = 40;
    const startY = (canvas.height - lines.length * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
    });
    
    // Add author
    ctx.font = '24px Arial';
    ctx.fillText(`- ${currentQuote.author}`, canvas.width / 2, startY + lines.length * lineHeight + 40);
    
    // Download
    const link = document.createElement('a');
    link.download = 'motivational-poster.png';
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('Poster downloaded successfully!');
  };

  if (!isLoaded || !currentQuote) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Poster Display */}
      <div 
        className="relative p-8 text-center min-h-[300px] flex flex-col justify-center"
        style={{ 
          background: currentQuote.imageUrl 
            ? `url(${currentQuote.imageUrl}) center/cover` 
            : currentQuote.backgroundColor,
          color: currentQuote.textColor
        }}
      >
        {currentQuote.imageUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        )}
        
        <div className="relative z-10">
          <blockquote className="text-xl md:text-2xl font-medium mb-4 leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-lg opacity-90">
            — {currentQuote.author}
          </cite>
          
          <div className="mt-4">
            <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
              {currentQuote.category}
            </span>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={generateRandomQuote}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              New Quote
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Custom
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-md transition-colors ${
                currentQuote.isFavorite 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart className={`h-4 w-4 ${currentQuote.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={shareQuote}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={downloadPoster}
              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Custom Quote Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Custom Quote</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <CustomQuoteForm 
                onSave={addCustomQuote}
                onCancel={() => setShowAddForm(false)}
                onAddPinterestPin={addPinterestPin}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Quote Form Component
function CustomQuoteForm({ 
  onSave, 
  onCancel, 
  onAddPinterestPin 
}: { 
  onSave: (quote: any) => void; 
  onCancel: () => void;
  onAddPinterestPin: (pin: PinterestPin) => void;
}) {
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    category: 'motivation' as 'motivation' | 'success' | 'perseverance' | 'wisdom' | 'upsc',
    imageUrl: '',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    pinterestUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text || !formData.author) {
      toast.error('Please fill in the quote text and author');
      return;
    }
    
    onSave({
      text: formData.text,
      author: formData.author,
      category: formData.category,
      imageUrl: formData.imageUrl,
      backgroundColor: formData.backgroundColor,
      textColor: formData.textColor
    });
  };

  const handlePinterestPin = () => {
    if (!formData.pinterestUrl) {
      toast.error('Please enter a Pinterest URL');
      return;
    }
    
    // Extract Pinterest pin info (simplified)
    const pinData: PinterestPin = {
      url: formData.pinterestUrl,
      description: 'Pinterest Pin',
      imageUrl: formData.pinterestUrl
    };
    
    onAddPinterestPin(pinData);
    setFormData({ ...formData, imageUrl: formData.pinterestUrl, pinterestUrl: '' });
    toast.success('Pinterest pin added as background!');
  };

  const backgroundOptions = [
    { name: 'Purple Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Pink Gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Blue Gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Green Gradient', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Orange Gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Soft Gradient', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quote Text *
        </label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          rows={3}
          placeholder="Enter your motivational quote..."
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author *
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Quote author"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="motivation">Motivation</option>
            <option value="success">Success</option>
            <option value="perseverance">Perseverance</option>
            <option value="wisdom">Wisdom</option>
            <option value="upsc">UPSC</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Pinterest URL (Optional)
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            value={formData.pinterestUrl}
            onChange={(e) => setFormData({ ...formData, pinterestUrl: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="https://pinterest.com/pin/..."
          />
          <button
            type="button"
            onClick={handlePinterestPin}
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Background
        </label>
        <div className="grid grid-cols-3 gap-2">
          {backgroundOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setFormData({ ...formData, backgroundColor: option.value })}
              className={`h-12 rounded-md border-2 transition-all ${
                formData.backgroundColor === option.value 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ background: option.value }}
              title={option.name}
            />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={formData.textColor}
            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Quote
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );
}
