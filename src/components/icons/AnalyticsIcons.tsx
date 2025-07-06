import React from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Target, Clock, BookOpen, Award,
  Calendar, Activity, Zap, Download, Upload, RefreshCw,
  ChevronDown, ChevronUp, Trash2
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

const iconMap = {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Activity,
  Zap,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Trash2,
};

const AnalyticsIcons: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in AnalyticsIcons`);
    return <div className={`bg-gray-300 rounded ${className || 'h-4 w-4'}`} />;
  }
  
  return <IconComponent className={className} />;
};

export default AnalyticsIcons;
