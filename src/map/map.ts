import type { MapNode, NodeKind } from '../types';
import { pick, shuffle } from '../rng';

const FLOORS = 8; // includes start (floor 0) and boss (floor 7)
const WIDTH = 4;

export function generateMap(rng: () => number, chapter = 1): MapNode[] {
  const _chapter = chapter;
  // Chapter 4 — true ending route: shorter than other chapters (5 floors)
  // but enough nodes to power up before the final boss.
  const floors = chapter === 4 ? 5 : FLOORS;
  const nodes: MapNode[] = [];
  const grid: (string | null)[][] = [];

  for (let y = 0; y < floors; y++) {
    grid[y] = [];
    for (let x = 0; x < WIDTH; x++) grid[y][x] = null;
  }

  // floor 0: start
  const startId = id(0, 0);
  nodes.push({ id: startId, kind: 'start', x: 0, y: 0, next: [], visited: true });
  grid[0][0] = startId;

  // intermediate floors: 2-3 nodes per floor
  for (let y = 1; y < floors - 1; y++) {
    const count = y === 1 ? 3 : 2 + Math.floor(rng() * 2); // 2 or 3
    const xs = shuffle(rng, [0, 1, 2, 3]).slice(0, count).sort((a, b) => a - b);
    for (const x of xs) {
      const k = pickKind(y, rng, _chapter, floors);
      const node: MapNode = {
        id: id(y, x),
        kind: k,
        x,
        y,
        next: [],
        visited: false,
      };
      nodes.push(node);
      grid[y][x] = node.id;
    }
  }

  // boss
  const bossId = id(floors - 1, 0);
  nodes.push({ id: bossId, kind: 'boss', x: 0, y: floors - 1, next: [], visited: false });
  grid[floors - 1][0] = bossId;

  // connect each floor to next floor — each node connects to 1-2 nearest nodes above
  for (let y = 0; y < floors - 1; y++) {
    const cur = grid[y].filter(Boolean) as string[];
    const above = grid[y + 1].filter(Boolean) as string[];
    for (const cid of cur) {
      const cn = nodeById(nodes, cid);
      if (y === floors - 2) {
        cn.next = [bossId];
        continue;
      }
      // sort above by distance
      const sorted = above
        .map((aid) => ({ id: aid, d: Math.abs(nodeById(nodes, aid).x - cn.x) }))
        .sort((a, b) => a.d - b.d);
      const links = rng() < 0.4 && sorted.length >= 2 ? 2 : 1;
      cn.next = sorted.slice(0, links).map((s) => s.id);
    }
    // ensure every above node is reachable from some current node — pick a random parent if orphaned
    for (const aid of above) {
      const reached = cur.some((cid) => nodeById(nodes, cid).next.includes(aid));
      if (!reached) {
        const parent = pick(rng, cur);
        const pn = nodeById(nodes, parent);
        if (!pn.next.includes(aid)) pn.next.push(aid);
      }
    }
  }

  return nodes;
}

function pickKind(floor: number, rng: () => number, chapter: number, floors = FLOORS): NodeKind {
  if (floor === floors - 2) return rng() < 0.7 ? 'rest' : 'combat';
  const r = rng();
  // Chapter 4: ultra-condensed — mostly elites + reward to power up before boss.
  if (chapter === 4) {
    if (floor === 1) {
      if (r < 0.55) return 'elite';
      if (r < 0.80) return 'combat';
      return 'reward';
    }
    // floor 2 (the floor before the rest before boss)
    if (r < 0.65) return 'elite';
    if (r < 0.85) return 'combat';
    return 'reward';
  }
  if (chapter === 1) {
    if (floor <= 2) {
      if (r < 0.6) return 'combat';
      if (r < 0.78) return 'reward';
      if (r < 0.90) return 'rest';
      return 'event';
    }
    if (r < 0.40) return 'combat';
    if (r < 0.57) return 'elite';
    if (r < 0.68) return 'rest';
    if (r < 0.80) return 'shop';
    if (r < 0.90) return 'reward';
    return 'event';
  }
  // Chapter 2
  if (chapter === 2) {
    if (floor <= 2) {
      if (r < 0.50) return 'combat';
      if (r < 0.68) return 'elite';
      if (r < 0.82) return 'rest';
      return 'event';
    }
    if (r < 0.30) return 'combat';
    if (r < 0.54) return 'elite';
    if (r < 0.65) return 'rest';
    if (r < 0.77) return 'shop';
    if (r < 0.88) return 'reward';
    return 'event';
  }
  // Chapter 3: most brutal — elites everywhere, few rests
  if (floor <= 2) {
    if (r < 0.35) return 'combat';
    if (r < 0.76) return 'elite';
    if (r < 0.88) return 'rest';
    return 'event';
  }
  if (r < 0.22) return 'combat';
  if (r < 0.60) return 'elite';
  if (r < 0.70) return 'rest';
  if (r < 0.82) return 'shop';
  if (r < 0.88) return 'reward';
  return 'event';
}

function id(y: number, x: number): string {
  return `n_${y}_${x}`;
}

export function nodeById(nodes: MapNode[], id: string): MapNode {
  const n = nodes.find((m) => m.id === id);
  if (!n) throw new Error(`unknown node ${id}`);
  return n;
}

export function startNode(nodes: MapNode[]): MapNode {
  return nodes.find((n) => n.kind === 'start')!;
}

export function nextNodes(nodes: MapNode[], from: MapNode): MapNode[] {
  return from.next.map((nid) => nodeById(nodes, nid));
}
