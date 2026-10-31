import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  ArrowUpDown,
  Calculator,
  X,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ExpenseItem, MemberId } from '../types';
import { TRIP_MEMBERS } from '../data/tripData';

interface ExpenseTrackerProps {
  expenses: ExpenseItem[];
  onUpdateExpenses: (newExpenses: ExpenseItem[]) => void;
  exchangeRate: number;
  onUpdateExchangeRate: (rate: number) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  onUpdateExpenses,
  exchangeRate,
  onUpdateExchangeRate,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCurrency, setFormCurrency] = useState<'KRW' | 'TWD'>('KRW');
  const [formPayer, setFormPayer] = useState<MemberId>('jessie');
  const [formCategory, setFormCategory] = useState<ExpenseItem['category']>('food');
  const [formDate, setFormDate] = useState('2026-12-31');
  const [formSplitWith, setFormSplitWith] = useState<MemberId[]>(['jessie', 'jase', 'jewel', 'kay']);
  const [formNote, setFormNote] = useState('');

  const [calcInputKRW, setCalcInputKRW] = useState<string>('50000');
  const [filterPayer, setFilterPayer] = useState<string>('all');

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getMember = (id: MemberId) => TRIP_MEMBERS.find((m) => m.id === id);

  const formatKRW = (amount: number) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);

  const formatTWD = (krwAmount: number) => {
    const twd = Math.round(krwAmount / exchangeRate);
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(twd);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...expenses];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    onUpdateExpenses(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= expenses.length) return;
    const updated = [...expenses];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onUpdateExpenses(updated);
  };

  const handleGroupByPayer = () => {
    const order: MemberId[] = ['jessie', 'jase', 'jewel', 'kay'];
    const sorted = [...expenses].sort((a, b) => {
      const pA = order.indexOf(a.payer);
      const pB = order.indexOf(b.payer);
      return pA - pB;
    });
    onUpdateExpenses(sorted);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormAmount('');
    setFormCurrency('KRW');
    setFormPayer('jessie');
    setFormCategory('food');
    setFormDate('2026-12-31');
    setFormSplitWith(['jessie', 'jase', 'jewel', 'kay']);
    setFormNote('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: ExpenseItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormAmount(item.amount.toString());
    setFormCurrency(item.currency);
    setFormPayer(item.payer);
    setFormCategory(item.category);
    setFormDate(item.date);
    setFormSplitWith(item.splitWith);
    setFormNote(item.note || '');
    setIsAddModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(formAmount);
    if (!formTitle.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const amountInKRW = formCurrency === 'TWD' ? Math.round(numAmount * exchangeRate) : Math.round(numAmount);

    if (editingItem) {
      const updated = expenses.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: formTitle.trim(),
              amount: amountInKRW,
              currency: formCurrency,
              payer: formPayer,
              category: formCategory,
              date: formDate,
              splitWith: formSplitWith,
              note: formNote.trim(),
            }
          : item
      );
      onUpdateExpenses(updated);
    } else {
      const newItem: ExpenseItem = {
        id: `exp-${Date.now()}`,
        title: formTitle.trim(),
        amount: amountInKRW,
        currency: formCurrency,
        payer: formPayer,
        category: formCategory,
        date: formDate,
        splitWith: formSplitWith,
        note: formNote.trim(),
      };
      onUpdateExpenses([newItem, ...expenses]);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onUpdateExpenses(expenses.filter((item) => item.id !== id));
  };

  const totalKRW = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const paidByMember: Record<MemberId, number> = { jessie: 0, jase: 0, jewel: 0, kay: 0 };
  expenses.forEach((item) => {
    paidByMember[item.payer] += item.amount;
  });

  const owedByMember: Record<MemberId, number> = { jessie: 0, jase: 0, jewel: 0, kay: 0 };
  expenses.forEach((item) => {
    const splitCount = item.splitWith.length || 4;
    const perPerson = item.amount / splitCount;
    item.splitWith.forEach((m) => {
      owedByMember[m] += perPerson;
    });
  });

  const visibleExpenses = expenses.filter(
    (item) => filterPayer === 'all' || item.payer === filterPayer
  );

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleGroupByPayer}
          className="px-3.5 py-2 text-xs font-black rounded-xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
          title="將同一個付款人的項目排在一起"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-900" />
          <span>按付款人排序</span>
        </button>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-black rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>記一筆花費</span>
        </button>
      </div>

      {/* Summary Metrics & Live Currency Calculator in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Total Expense Card */}
        <div className="bg-[#FF7675] text-white rounded-3xl p-5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase text-white/90 block">
              總支出累計
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-white mt-1">
              {formatKRW(totalKRW)}
            </div>
            <div className="text-xs font-black text-[#FFEAA7] mt-0.5 font-mono">
              ≈ {formatTWD(totalKRW)} (TWD) · 4人均攤: {formatTWD(totalKRW / 4)}
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-white">{expenses.length}</span>
            <span className="text-[10px] font-bold block text-white/80">筆款項</span>
          </div>
        </div>

        {/* Live Currency Calculator */}
        <div className="bg-[#FFEAA7] text-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              匯率換算機
            </span>
            <div className="flex items-center gap-1 text-[11px] font-black">
              <span>1 TWD =</span>
              <input
                type="number"
                step="0.1"
                value={exchangeRate}
                onChange={(e) => onUpdateExchangeRate(parseFloat(e.target.value) || 42.5)}
                className="w-14 px-1 py-0.5 text-right font-mono font-black bg-white border border-slate-900 rounded-md text-xs"
              />
              <span>KRW</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                step="1000"
                value={calcInputKRW}
                onChange={(e) => setCalcInputKRW(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-900 rounded-xl"
                placeholder="50000"
              />
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-900 shrink-0" />
            <div className="flex-1 px-2.5 py-1.5 text-xs font-mono font-black bg-white border border-slate-900 rounded-xl text-slate-900">
              {formatTWD(parseFloat(calcInputKRW) || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Payer Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterPayer('all')}
          className={`px-3 py-1 text-xs font-black rounded-xl transition-all whitespace-nowrap ${
            filterPayer === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-300 text-slate-700'
          }`}
        >
          全部 ({expenses.length})
        </button>
        {TRIP_MEMBERS.map((m) => (
          <button
            key={m.id}
            onClick={() => setFilterPayer(m.id)}
            className={`px-3 py-1 text-xs font-black rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterPayer === m.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
            <span>{m.name} 墊付</span>
          </button>
        ))}
      </div>

      {/* Draggable Expense List */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 block px-1">
          長按小卡上下拖曳可直接自訂排序：
        </span>

        {visibleExpenses.map((item, index) => {
          const payerMember = getMember(item.payer);
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={item.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-2xl p-3 sm:p-4 border-2 transition-all flex items-center justify-between gap-3 shadow-xs select-none ${
                isDragging
                  ? 'opacity-40 border-dashed border-slate-900 scale-[0.98]'
                  : isOver
                  ? 'border-slate-900 ring-2 ring-slate-900 bg-[#FFEAA7]/30'
                  : 'border-slate-900 hover:shadow-sm'
              }`}
            >
              <div
                className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-900 rounded-lg shrink-0"
                title="上下拖曳"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-slate-900 truncate">
                    {item.title}
                  </h4>
                  {payerMember && (
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900"
                      style={{ backgroundColor: payerMember.color }}
                    >
                      {payerMember.name} 墊付
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono font-bold">
                    {item.date}
                  </span>
                </div>

                {item.note && (
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    備註：{item.note}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm sm:text-base font-black text-slate-900 font-mono tabular-nums">
                  {formatKRW(item.amount)}
                </div>
                <div className="text-[11px] font-bold text-rose-600 font-mono">
                  ≈ {formatTWD(item.amount)}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Expense Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {editingItem ? '修改花費' : '新增花費'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-black text-slate-900 mb-1">項目名稱 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：烤肉的男子 晚餐"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-900 mb-1">金額 *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="例如：120000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono font-black bg-slate-50 border-2 border-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">幣別</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value as 'KRW' | 'TWD')}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold"
                  >
                    <option value="KRW">韓元 (KRW ₩)</option>
                    <option value="TWD">新台幣 (TWD NT$)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-900 mb-1">誰代墊？</label>
                  <select
                    value={formPayer}
                    onChange={(e) => setFormPayer(e.target.value as MemberId)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold"
                  >
                    {TRIP_MEMBERS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.badge})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">分類</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseItem['category'])}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold"
                  >
                    <option value="food">餐飲美食</option>
                    <option value="transport">交通車資</option>
                    <option value="hotel">飯店住宿</option>
                    <option value="ticket">門票體驗</option>
                    <option value="shopping">購物選物</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">日期</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-black hover:bg-slate-800"
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
