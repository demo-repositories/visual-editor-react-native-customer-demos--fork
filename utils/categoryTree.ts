export type CategoryNodeInput = {
  _id: string
  parentId?: string | null
}

/**
 * Returns the set of ids for `rootId` plus all of its descendants (to any depth).
 * GROQ can't traverse the hierarchy recursively, so we build a parent -> children
 * map from the full (per-locale) category list and walk it client-side.
 */
export function getDescendantIds(categories: CategoryNodeInput[], rootId: string): string[] {
  const childrenByParent = new Map<string, string[]>()
  for (const cat of categories) {
    if (!cat?.parentId) continue
    const list = childrenByParent.get(cat.parentId) ?? []
    list.push(cat._id)
    childrenByParent.set(cat.parentId, list)
  }

  const result: string[] = []
  const seen = new Set<string>()
  const stack: string[] = [rootId]
  while (stack.length > 0) {
    const id = stack.pop() as string
    if (seen.has(id)) continue
    seen.add(id)
    result.push(id)
    const children = childrenByParent.get(id)
    if (children) stack.push(...children)
  }
  return result
}
