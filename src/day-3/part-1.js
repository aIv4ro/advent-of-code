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

const partNumbers = linesMatches.flatMap((lineMatches, row) => {
  const line = lines[row]
  return lineMatches.filter(({ match, index }) => {
    const startRow = Math.max(row - 1, 0)
    const endRow = Math.min(row + 1, lines.length - 1)
    const startCol = Math.max(index - 1, 0)
    const endCol = Math.min(index + match.length, line.length - 1)
    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        const char = lines[y][x]
        if (char !== '.' && isNaN(Number(char))) return true
      }
    }
    return false
  })
})

const result = partNumbers.reduce((acc, { num }) => acc + num, 0)

console.log(result)
