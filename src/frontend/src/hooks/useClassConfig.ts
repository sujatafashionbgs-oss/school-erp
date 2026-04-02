import {
  SECTIONS as ALL_SECTIONS,
  CLASSES as DEFAULT_CLASSES,
} from "../data/classConfig";

const STORAGE_KEY = "classConfig";

export type ClassConfig = Record<string, string[]>; // className -> active sections

export function loadClassConfig(): ClassConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as ClassConfig;
  } catch {
    // ignore
  }
  // Default: all classes with sections A-D active
  const defaults: ClassConfig = {};
  for (const cls of DEFAULT_CLASSES) {
    defaults[cls] = ["A", "B", "C", "D"];
  }
  return defaults;
}

export function saveClassConfig(config: ClassConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function useClassConfig() {
  const config = loadClassConfig();

  const getActiveSections = (className: string): string[] => {
    return config[className] ?? ["A", "B", "C", "D"];
  };

  const getAllClasses = () => DEFAULT_CLASSES;
  const getAllSections = () => ALL_SECTIONS;

  return { config, getActiveSections, getAllClasses, getAllSections };
}
