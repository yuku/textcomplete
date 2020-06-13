let promise: Promise<[string, string][]> | null = null

const load = async (): Promise<[string, string][]> => {
  if (promise == null) {
    promise = new Promise<[string, string][]>(async (resolve) => {
      const response = await fetch("https://api.github.com/emojis")
      resolve(Object.entries(await response.json()))
    })
  }
  return promise
}

export const startsWith = async (
  term: string,
  limit = 10
): Promise<[string, string][]> => {
  const kvs = await load()
  const results: [string, string][] = []
  // Whether previous key started with the term
  let prevMatch = false
  for (const [key, url] of kvs) {
    if (key.startsWith(term)) {
      results.push([key, url])
      if (results.length === limit) break
      prevMatch = true
    } else if (prevMatch) {
      break
    }
  }
  return results
}
