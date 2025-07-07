import React from 'react';
import {
  Play, Trophy, Target, Clock, BookOpen, Star,
  TrendingUp, Award, Flame, CheckCircle, XCircle,
  RotateCcw, Bookmark, Filter, Search, Calendar,
  BarChart3, PieChart, Users, Medal, Zap, ArrowLeft,
  ArrowRight, X
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

const iconMap = {
  Play,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  Award,
  Flame,
  CheckCircle,
  XCircle,
  RotateCcw,
  Bookmark,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  Users,
  Medal,
  Zap,
  ArrowLeft,
  ArrowRight,
  X,
};

const PracticeIcons: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in PracticeIcons`);
    return <div className={`bg-gray-300 rounded ${className || 'h-4 w-4'}`} />;
  }
  
  return <IconComponent className={className} />;
};

export default PracticeIcons;
