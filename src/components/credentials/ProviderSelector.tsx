'use client';

import { useState, useEffect } from 'react';

interface ProviderSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const STORAGE_KEY = 'credentials_providers';
const DEFAULT_PROVIDERS = ['Huawei'];

/**
 * Provider Selector Component
 * Allows selection, adding, editing, and removing cloud providers
 */
export default function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  const [providers, setProviders] = useState<string[]>(DEFAULT_PROVIDERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<string>('');
  const [newProviderName, setNewProviderName] = useState('');
  const [editProviderName, setEditProviderName] = useState('');
  const [error, setError] = useState<string>('');

  // Load providers from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProviders(parsed);
          // If current value is not in the list, set to first item
          if (!parsed.includes(value)) {
            onChange(parsed[0]);
          }
        }
      } catch (e) {
        // If parsing fails, use default
        setProviders(DEFAULT_PROVIDERS);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage whenever providers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
  }, [providers]);

  const handleAdd = () => {
    setError('');
    const trimmed = newProviderName.trim();
    
    if (!trimmed) {
      setError('Provider name is required');
      return;
    }
    
    if (providers.includes(trimmed)) {
      setError('Provider already exists');
      return;
    }
    
    const updated = [...providers, trimmed];
    setProviders(updated);
    onChange(trimmed);
    setNewProviderName('');
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setError('');
    const trimmed = editProviderName.trim();
    
    if (!trimmed) {
      setError('Provider name is required');
      return;
    }
    
    if (trimmed !== editingProvider && providers.includes(trimmed)) {
      setError('Provider name already exists');
      return;
    }
    
    const updated = providers.map(p => p === editingProvider ? trimmed : p);
    setProviders(updated);
    
    // Update selected value if it was the edited one
    if (value === editingProvider) {
      onChange(trimmed);
    }
    
    setShowEditModal(false);
    setEditingProvider('');
    setEditProviderName('');
  };

  const handleDelete = (providerToDelete: string) => {
    if (providers.length <= 1) {
      alert('Cannot delete the last provider. At least one provider must exist.');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete "${providerToDelete}"?`)) {
      return;
    }
    
    const updated = providers.filter(p => p !== providerToDelete);
    setProviders(updated);
    
    // If deleted provider was selected, select the first available
    if (value === providerToDelete) {
      onChange(updated[0]);
    }
  };

  const openEditModal = (provider: string) => {
    setEditingProvider(provider);
    setEditProviderName(provider);
    setError('');
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="provider-select" className="block text-sm font-semibold text-gray-700">
          Provider
        </label>
        <button
          type="button"
          onClick={() => {
            setNewProviderName('');
            setError('');
            setShowAddModal(true);
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          aria-label="Add new provider"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>
      
      <div className="flex gap-2">
        <select
          id="provider-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm hover:border-gray-400"
          aria-label="Select provider"
        >
          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => openEditModal(value)}
          className="px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 rounded-xl transition-colors"
          aria-label="Edit provider"
          title="Edit provider"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleDelete(value)}
          disabled={providers.length <= 1}
          className="px-3 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete provider"
          title="Delete provider"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <p className="mt-2 text-xs text-gray-500">
        Select, add, edit, or remove cloud providers for credential management
      </p>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Provider</h3>
            <div>
              <label htmlFor="new-provider" className="block text-sm font-semibold text-gray-700 mb-2">
                Provider Name
              </label>
              <input
                id="new-provider"
                type="text"
                value={newProviderName}
                onChange={(e) => {
                  setNewProviderName(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Enter provider name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setNewProviderName('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Provider</h3>
            <div>
              <label htmlFor="edit-provider" className="block text-sm font-semibold text-gray-700 mb-2">
                Provider Name
              </label>
              <input
                id="edit-provider"
                type="text"
                value={editProviderName}
                onChange={(e) => {
                  setEditProviderName(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                placeholder="Enter provider name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProvider('');
                  setEditProviderName('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

