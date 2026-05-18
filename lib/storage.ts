"use client";

import type { EvalResultPayload } from "./eval/types";

const STORAGE_KEY = "evalforge.tasks.v1";

export interface StoredTask extends EvalResultPayload {
  label: string;
}

export function loadTasks(): StoredTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: StoredTask[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.slice(0, 25)));
}

export function addTask(result: EvalResultPayload, label?: string): StoredTask[] {
  const tasks = loadTasks();
  const next: StoredTask = {
    ...result,
    label: label?.trim() || `${result.category} evaluation - ${new Date(result.createdAt).toLocaleString()}`,
  };
  const updated = [next, ...tasks.filter((task) => task.id !== result.id)].slice(0, 25);
  saveTasks(updated);
  return updated;
}

export function clearTasks() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
