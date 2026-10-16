import { useState } from 'react';

/* Qo'shish / tahrirlash / o'chirish oynalarining holatini boshqaradi.
   Har bir sahifa o'z modalini o'zi chizadi, bu hook faqat mantiq. */
export default function useCrud(emptyForm) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setOpen(true);
  };

  const openEdit = (item) => {
    setForm({ ...emptyForm, ...item });
    setEditId(item.id);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return { open, editId, form, setForm, openCreate, openEdit, close, onChange, deleteId, setDeleteId };
}
