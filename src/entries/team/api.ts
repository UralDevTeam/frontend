import { TeamNode } from "./model";

// Симуляция API — в реальности замените fetch на ваш API клиент
export async function fetchTeams(): Promise<TeamNode[]> {
  // небольшая задержка для симуляции
  await new Promise(res => setTimeout(res, 100));
  const mod = await import('./model');
  return mod.generateSampleTeams(10, 4, 6);
}

