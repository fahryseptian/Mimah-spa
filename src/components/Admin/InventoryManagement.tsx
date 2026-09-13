import React, { useState } from 'react';
import { Package, Plus, Edit3, Trash2, AlertTriangle, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';

export const InventoryManagement: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ name: '', category: 'alat', unit: 'pcs', minStock: 0 });

  const handleAdd = () => {
    if (newItem.name && newItem.category && newItem.unit) {
      addInventoryItem({
        id: 'inv-' + Date.now(),
        name: newItem.name,
        category: newItem.category,
        unit: newItem.unit,
        minStock: newItem.minStock || 0
      } as InventoryItem);
      setNewItem({ name: '', category: 'alat', unit: 'pcs', minStock: 0 });
      setIsAdding(false);
    }
  };
    return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-600" />
          Manajemen Stok Produk & Perlengkapan
        </h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> {isAdding ? 'Batal' : 'Tambah Barang'}
        </button>
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-4 p-4 bg-stone-50 rounded-xl">
          <input className="flex-1 p-2 rounded border" placeholder="Nama Barang" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
          <select className="p-2 rounded border" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as any})}>
            <option value="alat">Alat</option>
            <option value="bahan">Bahan</option>
            <option value="seragam">Seragam</option>
          </select>
          <input className="w-20 p-2 rounded border" placeholder="Satuan" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} />
          <input className="w-20 p-2 rounded border" type="number" placeholder="Min Stock" value={newItem.minStock} onChange={e => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})} />
          <button onClick={handleAdd} className="bg-emerald-600 text-white p-2 rounded"><Save /></button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
              <th className="pb-3">Nama Barang</th>
              <th className="pb-3">Kategori</th>
              <th className="pb-3">Satuan</th>
              <th className="pb-3 text-center">Stok Min.</th>
              <th className="pb-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {inventory.map((item) => (
              <tr key={item.id} className="text-xs text-stone-700">
                <td className="py-4 font-bold">{item.name}</td>
                <td className="py-4 capitalize">{item.category}</td>
                <td className="py-4">{item.unit}</td>
                <td className="py-4 text-center">{item.minStock}</td>
                <td className="py-4 text-right">
                  <button className="text-emerald-600 hover:text-emerald-700 mr-2"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => deleteInventoryItem(item.id)} className="text-rose-600 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
