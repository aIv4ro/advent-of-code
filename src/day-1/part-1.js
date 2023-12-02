import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const lines = input.split('\r\n')
const numRegex = /[0-9]/g

const linesNums = lines.map(line => {
  const matches = line.match(numRegex)
  return Number(`${matches[0]}${matches[matches.length - 1]}`)
})

const sum = linesNums.reduce((acc, cur) => acc + cur, 0)

console.log(sum)
