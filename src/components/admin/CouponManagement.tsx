'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Calendar,
  Percent,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'trial_extension';
  value: number;
  maxUses: number;
  currentUses: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicablePlans: string[];
  createdAt: string;
  createdBy: string;
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'trial_extension',
    value: 0,
    maxUses: 100,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    applicablePlans: ['pro'] as string[]
  });

  // Load coupons from API
  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons || []);
      } else {
        toast.error('Failed to load coupons');
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('Error loading coupons');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate random coupon code with better patterns
  const generateCouponCode = () => {
    const patterns = [
      () => `UPSC${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      () => `SAVE${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      () => `PREP${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      () => `STUDY${Math.random().toString(36).substr(2, 3).toUpperCase()}`
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return pattern();
  };

  // Enhanced coupon validation
  const validateCoupon = (coupon: any) => {
    const errors: string[] = [];

    if (!coupon.code || coupon.code.length < 3) {
      errors.push('Coupon code must be at least 3 characters');
    }

    if (!coupon.description || coupon.description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }

    if (coupon.type === 'percentage' && (coupon.value <= 0 || coupon.value > 100)) {
      errors.push('Percentage value must be between 1 and 100');
    }

    if (coupon.type === 'fixed' && coupon.value <= 0) {
      errors.push('Fixed amount must be greater than 0');
    }

    if (new Date(coupon.validFrom) >= new Date(coupon.validUntil)) {
      errors.push('Valid until date must be after valid from date');
    }

    return errors;
  };

  // Create new coupon
  const createCoupon = async () => {
    // Enhanced validation
    const validationErrors = validateCoupon(newCoupon);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    try {
      setIsLoading(true);

      // Check for duplicate coupon codes
      const existingCoupon = coupons.find(c => c.code.toLowerCase() === newCoupon.code.toLowerCase());
      if (existingCoupon) {
        toast.error('Coupon code already exists');
        return;
      }

      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCoupon,
          code: newCoupon.code.toUpperCase(),
          createdBy: 'admin' // This should come from session
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Coupon created successfully!');
        setShowCreateForm(false);
        setNewCoupon({
          code: '',
          description: '',
          type: 'percentage',
          value: 0,
          maxUses: 100,
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: '',
          applicablePlans: ['pro']
        });
        loadCoupons();

        // Copy coupon code to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(data.coupon.code);
          toast.success('Coupon code copied to clipboard!');
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('Error creating coupon');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle coupon status
  const toggleCouponStatus = async (couponId: string) => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}/toggle`, {
        method: 'PATCH'
      });

      if (response.ok) {
        toast.success('Coupon status updated');
        loadCoupons();
      } else {
        toast.error('Failed to update coupon status');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Error updating coupon');
    }
  };

  // Delete coupon
  const deleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Coupon deleted successfully');
        loadCoupons();
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Error deleting coupon');
    }
  };

  // Copy coupon code to clipboard
  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard!');
  };

  // Filter coupons
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    const isExpired = validUntil < now;
    
    switch (filterStatus) {
      case 'active':
        return matchesSearch && coupon.isActive && !isExpired;
      case 'inactive':
        return matchesSearch && !coupon.isActive;
      case 'expired':
        return matchesSearch && isExpired;
      default:
        return matchesSearch;
    }
  });

  const getStatusColor = (coupon: Coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    const isExpired = validUntil < now;
    
    if (isExpired) return 'bg-gray-100 text-gray-800';
    if (!coupon.isActive) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (coupon: Coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    const isExpired = validUntil < now;

    if (isExpired) return 'Expired';
    if (!coupon.isActive) return 'Inactive';
    return 'Active';
  };

  // Utility functions
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Bulk operations
  const handleSelectCoupon = (couponId: string) => {
    setSelectedCoupons(prev =>
      prev.includes(couponId)
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCoupons.length === filteredCoupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(filteredCoupons.map(c => c.id));
    }
  };

  const bulkActivate = async () => {
    if (selectedCoupons.length === 0) return;

    try {
      setIsLoading(true);
      // For now, update locally - in production this would call the API
      setCoupons(prev => prev.map(coupon =>
        selectedCoupons.includes(coupon.id)
          ? { ...coupon, isActive: true }
          : coupon
      ));

      toast.success(`${selectedCoupons.length} coupons activated`);
      setSelectedCoupons([]);
    } catch (error) {
      toast.error('Error activating coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDeactivate = async () => {
    if (selectedCoupons.length === 0) return;

    try {
      setIsLoading(true);
      // For now, update locally - in production this would call the API
      setCoupons(prev => prev.map(coupon =>
        selectedCoupons.includes(coupon.id)
          ? { ...coupon, isActive: false }
          : coupon
      ));

      toast.success(`${selectedCoupons.length} coupons deactivated`);
      setSelectedCoupons([]);
    } catch (error) {
      toast.error('Error deactivating coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (selectedCoupons.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedCoupons.length} coupons? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      // For now, update locally - in production this would call the API
      setCoupons(prev => prev.filter(coupon => !selectedCoupons.includes(coupon.id)));

      toast.success(`${selectedCoupons.length} coupons deleted`);
      setSelectedCoupons([]);
    } catch (error) {
      toast.error('Error deleting coupons');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupon Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="all">All Coupons</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Create Coupon Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="Enter code or generate"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  onClick={() => setNewCoupon({ ...newCoupon, code: generateCouponCode() })}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                placeholder="e.g., New Year Special Discount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Type
              </label>
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount</option>
                <option value="trial_extension">Trial Extension (days)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value
              </label>
              <input
                type="number"
                value={newCoupon.value}
                onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                placeholder={newCoupon.type === 'percentage' ? '10' : newCoupon.type === 'fixed' ? '200' : '7'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Uses
              </label>
              <input
                type="number"
                value={newCoupon.maxUses}
                onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={newCoupon.validUntil}
                onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={createCoupon}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Create Coupon
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Coupons List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Percent className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No coupons found</p>
            <p className="text-sm">Create your first coupon to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm font-mono">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCouponCode(coupon.code)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy code"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{coupon.description}</div>
                      <div className="text-xs text-gray-500">Valid until {new Date(coupon.validUntil).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {coupon.type === 'percentage' && `${coupon.value}%`}
                        {coupon.type === 'fixed' && `₹${coupon.value}`}
                        {coupon.type === 'trial_extension' && `${coupon.value} days`}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{coupon.type.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {coupon.currentUses} / {coupon.maxUses}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-red-600 h-1.5 rounded-full" 
                          style={{ width: `${(coupon.currentUses / coupon.maxUses) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(coupon)}`}>
                        {getStatusText(coupon)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCouponStatus(coupon.id)}
                          className={`p-1 rounded transition-colors ${
                            coupon.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={coupon.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {coupon.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete coupon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
