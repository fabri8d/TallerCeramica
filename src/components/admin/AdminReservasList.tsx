"use client";

import { useState, useMemo, useCallback } from "react";
import { formatDateShort, formatSlotTime } from "@/lib/utils";
import ReservaFormModal from "./ReservaFormModal";
import type { Booking } from "@/types";

interface Props {
  initialBookings: Booking[];
  initialCapacity: number;
}

type StatusFilter = "todas" | "confirmed" | "cancelled";

export default function AdminReservasList({ initialBookings, initialCapacity }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [capacity, setCapacity] = useState(initialCapacity);
  const [editingCapacity, setEditingCapacity] = useState(false);
  const [capacityInput, setCapacityInput] = useState(String(initialCapacity));
  const [savingCapacity, setSavingCapacity] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bookings.filter((b) => {
      if (q) {
        const haystack = `${b.nombre} ${b.apellido} ${b.email}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (statusFilter !== "todas" && b.status !== statusFilter) return false;
      if (dateFrom && b.booking_date < dateFrom) return false;
      if (dateTo && b.booking_date > dateTo) return false;
      return true;
    });
  }, [bookings, search, statusFilter, dateFrom, dateTo]);

  const filteredIds = useMemo(() => filtered.map((b) => b.id), [filtered]);
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));
  const selectedInView = filteredIds.filter((id) => selected.has(id)).length;

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => new Set([...prev, ...filteredIds]));
    }
  }

  const openCreate = () => { setEditingBooking(undefined); setModalOpen(true); };
  const openEdit = (b: Booking) => { setEditingBooking(b); setModalOpen(true); };

  const handleSaved = useCallback((saved: Booking) => {
    setBookings((prev) => {
      const exists = prev.find((b) => b.id === saved.id);
      if (exists) return prev.map((b) => (b.id === saved.id ? saved : b));
      return [saved, ...prev];
    });
    setModalOpen(false);
  }, []);

  async function toggleStatus(b: Booking) {
    const newStatus = b.status === "confirmed" ? "cancelled" : "confirmed";
    const res = await fetch(`/api/admin/bookings/${b.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, status: newStatus }),
    });
    if (res.ok) {
      const { booking } = await res.json();
      setBookings((prev) => prev.map((x) => (x.id === b.id ? booking : x)));
    }
  }

  async function handleDelete(b: Booking) {
    if (!confirm(`¿Eliminar la reserva de ${b.nombre} ${b.apellido}? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/bookings/${b.id}`, { method: "DELETE" });
    if (res.ok) {
      setBookings((prev) => prev.filter((x) => x.id !== b.id));
      setSelected((prev) => { const n = new Set(prev); n.delete(b.id); return n; });
    } else alert("Error al eliminar la reserva");
  }

  async function bulkDelete() {
    const ids = [...selected].filter((id) => filteredIds.includes(id));
    if (!ids.length) return;
    if (!confirm(`¿Eliminar ${ids.length} reserva${ids.length !== 1 ? "s" : ""}? Esta acción no se puede deshacer.`)) return;
    setBulkLoading(true);
    await Promise.all(ids.map((id) => fetch(`/api/admin/bookings/${id}`, { method: "DELETE" })));
    setBookings((prev) => prev.filter((b) => !ids.includes(b.id)));
    setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
    setBulkLoading(false);
  }

  async function bulkSetStatus(status: "confirmed" | "cancelled") {
    const ids = [...selected].filter((id) => filteredIds.includes(id));
    if (!ids.length) return;
    setBulkLoading(true);
    const results = await Promise.all(
      ids.map(async (id) => {
        const booking = bookings.find((b) => b.id === id)!;
        const res = await fetch(`/api/admin/bookings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...booking, status }),
        });
        return res.ok ? { ...(await res.json()).booking } as Booking : null;
      })
    );
    setBookings((prev) =>
      prev.map((b) => {
        const updated = results.find((r) => r && r.id === b.id);
        return updated ?? b;
      })
    );
    setBulkLoading(false);
  }

  async function saveCapacity() {
    const val = parseInt(capacityInput, 10);
    if (!Number.isInteger(val) || val < 1) { alert("Capacidad inválida"); return; }
    setSavingCapacity(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_capacity: val }),
    });
    setSavingCapacity(false);
    if (res.ok) { setCapacity(val); setEditingCapacity(false); }
    else alert("Error al guardar la capacidad");
  }

  const statusButtons: { value: StatusFilter; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "confirmed", label: "Confirmadas" },
    { value: "cancelled", label: "Canceladas" },
  ];

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-serif text-3xl text-bark-900">Reservas</h1>
          <div className="flex items-center gap-2 bg-white border border-linen rounded-sm px-3 py-1.5">
            <span className="font-sans text-xs text-clay-400">Capacidad por turno:</span>
            {editingCapacity ? (
              <>
                <input
                  type="number"
                  min={1}
                  value={capacityInput}
                  onChange={(e) => setCapacityInput(e.target.value)}
                  className="w-14 font-sans text-sm border border-linen rounded-sm px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
                />
                <button onClick={saveCapacity} disabled={savingCapacity} className="font-sans text-xs font-bold text-terracotta-500 hover:text-terracotta-600 disabled:opacity-50">
                  {savingCapacity ? "..." : "Guardar"}
                </button>
                <button onClick={() => { setEditingCapacity(false); setCapacityInput(String(capacity)); }} className="font-sans text-xs text-clay-400 hover:text-bark-900">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="font-sans text-sm font-bold text-bark-900">{capacity}</span>
                <button onClick={() => setEditingCapacity(true)} className="font-sans text-xs text-clay-400 hover:text-terracotta-500" title="Editar capacidad">✏️</button>
              </>
            )}
          </div>
        </div>
        <button
          onClick={openCreate}
          className="font-sans text-sm font-bold bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-sm transition-colors"
        >
          + Nueva reserva
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 font-sans text-sm border border-linen rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
        />
        <div className="flex gap-1">
          {statusButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setStatusFilter(btn.value)}
              className={`font-sans text-xs font-bold px-3 py-2 rounded-sm transition-colors ${
                statusFilter === btn.value
                  ? "bg-terracotta-500 text-white"
                  : "bg-white border border-linen text-clay-500 hover:border-terracotta-300"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-clay-400">Desde</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="font-sans text-sm border border-linen rounded-sm px-2 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400" />
          <span className="font-sans text-xs text-clay-400">Hasta</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="font-sans text-sm border border-linen rounded-sm px-2 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-400" />
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedInView > 0 && (
        <div className="flex items-center gap-3 bg-terracotta-50 border border-terracotta-200 rounded-sm px-4 py-2.5">
          <span className="font-sans text-sm font-bold text-terracotta-700">
            {selectedInView} seleccionada{selectedInView !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2 ml-auto flex-wrap">
            <button
              onClick={() => bulkSetStatus("confirmed")}
              disabled={bulkLoading}
              className="font-sans text-xs font-bold px-3 py-1.5 rounded-sm bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition-colors"
            >
              Confirmar
            </button>
            <button
              onClick={() => bulkSetStatus("cancelled")}
              disabled={bulkLoading}
              className="font-sans text-xs font-bold px-3 py-1.5 rounded-sm bg-clay-100 text-clay-600 hover:bg-clay-200 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={bulkDelete}
              disabled={bulkLoading}
              className="font-sans text-xs font-bold px-3 py-1.5 rounded-sm bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              {bulkLoading ? "..." : "Eliminar"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-sm p-12 text-center shadow-sm">
          <p className="font-serif text-xl text-bark-900">
            {bookings.length === 0 ? "No hay reservas aún" : "Sin resultados"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-clay-100 border-b border-linen">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded cursor-pointer accent-terracotta-500"
                    title={allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                  />
                </th>
                {["Fecha", "Hora", "Alumno", "Email", "Teléfono", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="font-sans text-xs text-clay-400 uppercase tracking-wider text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {filtered.map((b) => {
                const isSelected = selected.has(b.id);
                return (
                  <tr key={b.id} className={`transition-colors ${isSelected ? "bg-terracotta-50" : "hover:bg-clay-100"}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(b.id)}
                        className="rounded cursor-pointer accent-terracotta-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-bark-900 whitespace-nowrap">{formatDateShort(b.booking_date)}</td>
                    <td className="px-4 py-3 font-sans text-sm text-bark-900 whitespace-nowrap">{formatSlotTime(b.slot_time)}</td>
                    <td className="px-4 py-3 font-sans text-sm font-bold text-bark-900 whitespace-nowrap">{b.nombre} {b.apellido}</td>
                    <td className="px-4 py-3 font-sans text-sm text-clay-500">{b.email}</td>
                    <td className="px-4 py-3 font-sans text-sm text-clay-500 whitespace-nowrap">{b.telefono}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(b)}
                        className={`font-sans text-xs font-bold px-2 py-1 rounded-sm transition-colors cursor-pointer ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-clay-200 text-clay-500 hover:bg-clay-300"
                        }`}
                        title="Click para cambiar estado"
                      >
                        {b.status === "confirmed" ? "Confirmada" : "Cancelada"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(b)} className="font-sans text-xs text-terracotta-500 hover:text-terracotta-600 font-bold transition-colors">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(b)} className="font-sans text-xs text-clay-400 hover:text-red-600 font-bold transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ReservaFormModal
          booking={editingBooking}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
