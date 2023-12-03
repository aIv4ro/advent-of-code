import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const lines = input.split('\r\n')

const numRegex = /[0-9]+/g
const linesMatches = lines.map(line => {
  const matches = Array.from(line.matchAll(numRegex))
  return matches.map(({ 0: match, index }) => {
    return { match, num: Number(match), index }
  })
})

const gearParts = {}
linesMatches.forEach((lineMatches, row) => {
  const line = lines[row]
  for (const { match, index, num } of lineMatches) {
    const startRow = Math.max(row - 1, 0)
    const endRow = Math.min(row + 1, lines.length - 1)
    const startCol = Math.max(index - 1, 0)
    const endCol = Math.min(index + match.length, line.length - 1)
    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        const char = lines[y][x]
        if (char === '*') {
          const coord = `${y}-${x}`
          gearParts[coord] ??= []
          gearParts[coord].push(num)
        }
      }
    }
  }
})

const gearRatios = Object.values(gearParts)
  .filter(gearPart => gearPart.length === 2)
  .map(gearPart => gearPart.reduce((acc, cur) => acc * cur, 1))

const result = gearRatios.reduce((acc, cur) => acc + cur, 0)

console.log(result)
