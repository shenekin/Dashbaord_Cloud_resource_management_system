'use client';

import { useState, useEffect } from 'react';

interface CustomerSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const STORAGE_KEY = 'credentials_customers';
const DEFAULT_CUSTOMERS = ['Ekin'];

/**
 * Customer Selector Component
 * Allows selection, adding, editing, and removing customers
 */
export default function CustomerSelector({ value, onChange }: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<string[]>(DEFAULT_CUSTOMERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [error, setError] = useState<string>('');

  // Load customers from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomers(parsed);
          // If current value is not in the list, set to first item
          if (!parsed.includes(value)) {
            onChange(parsed[0]);
          }
        }
      } catch (e) {
        // If parsing fails, use default
        setCustomers(DEFAULT_CUSTOMERS);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const handleAdd = () => {
    setError('');
    const trimmed = newCustomerName.trim();
    
    if (!trimmed) {
      setError('Customer name is required');
      return;
    }
    
    if (customers.includes(trimmed)) {
      setError('Customer already exists');
      return;
    }
    
    const updated = [...customers, trimmed];
    setCustomers(updated);
    onChange(trimmed);
    setNewCustomerName('');
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setError('');
    const trimmed = editCustomerName.trim();
    
    if (!trimmed) {
      setError('Customer name is required');
      return;
    }
    
    if (trimmed !== editingCustomer && customers.includes(trimmed)) {
      setError('Customer name already exists');
      return;
    }
    
    const updated = customers.map(c => c === editingCustomer ? trimmed : c);
    setCustomers(updated);
    
    // Update selected value if it was the edited one
    if (value === editingCustomer) {
      onChange(trimmed);
    }
    
    setShowEditModal(false);
    setEditingCustomer('');
    setEditCustomerName('');
  };

  const handleDelete = (customerToDelete: string) => {
    if (customers.length <= 1) {
      alert('Cannot delete the last customer. At least one customer must exist.');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete "${customerToDelete}"?`)) {
      return;
    }
    
    const updated = customers.filter(c => c !== customerToDelete);
    setCustomers(updated);
    
    // If deleted customer was selected, select the first available
    if (value === customerToDelete) {
      onChange(updated[0]);
    }
  };

  const openEditModal = (customer: string) => {
    setEditingCustomer(customer);
    setEditCustomerName(customer);
    setError('');
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="customer-select" className="block text-sm font-semibold text-gray-700">
          Customer
        </label>
        <button
          type="button"
          onClick={() => {
            setNewCustomerName('');
            setError('');
            setShowAddModal(true);
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          aria-label="Add new customer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>
      
      <div className="flex gap-2">
        <select
          id="customer-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 shadow-sm hover:border-gray-400"
          aria-label="Select customer"
        >
          {customers.map((customer) => (
            <option key={customer} value={customer}>
              {customer}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => openEditModal(value)}
          className="px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 rounded-xl transition-colors"
          aria-label="Edit customer"
          title="Edit customer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleDelete(value)}
          disabled={customers.length <= 1}
          className="px-3 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete customer"
          title="Delete customer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <p className="mt-2 text-xs text-gray-500">
        Select, add, edit, or remove customers for credential management
      </p>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Customer</h3>
            <div>
              <label htmlFor="new-customer" className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                id="new-customer"
                type="text"
                value={newCustomerName}
                onChange={(e) => {
                  setNewCustomerName(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Enter customer name"
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
                  setNewCustomerName('');
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Customer</h3>
            <div>
              <label htmlFor="edit-customer" className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                id="edit-customer"
                type="text"
                value={editCustomerName}
                onChange={(e) => {
                  setEditCustomerName(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                placeholder="Enter customer name"
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
                  setEditingCustomer('');
                  setEditCustomerName('');
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

