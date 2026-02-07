import { generateId } from '@/lib/uuid';
import type { NewCategory } from './schema';

interface DefaultCategorySeed {
  name: string;
  color: string;
  icon: string;
  sortOrder: number;
}

const CATEGORY_SEEDS: DefaultCategorySeed[] = [
  { name: 'Health', color: '#EF4444', icon: '💪', sortOrder: 0 },
  { name: 'Personal Growth', color: '#22C55E', icon: '🌱', sortOrder: 1 },
  { name: 'Study', color: '#3B82F6', icon: '📚', sortOrder: 2 },
  { name: 'Work', color: '#F59E0B', icon: '💼', sortOrder: 3 },
  { name: 'Finance', color: '#8B5CF6', icon: '💰', sortOrder: 4 },
  { name: 'Social', color: '#EC4899', icon: '👥', sortOrder: 5 },
];

export function buildDefaultCategories(): NewCategory[] {
  const now = new Date().toISOString();
  return CATEGORY_SEEDS.map((seed) => ({
    id: generateId(),
    name: seed.name,
    color: seed.color,
    icon: seed.icon,
    sortOrder: seed.sortOrder,
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  }));
}
