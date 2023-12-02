import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const lines = input.split('\r\n')
const numRegex = /one|two|three|four|five|six|seven|eight|nine|[0-9]/g

const strToNum = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
}

function matchOverlap (input, regex) {
  const result = []
  let match = regex.exec(input)
  while (match != null) {
    regex.lastIndex -= match[0].length - 1
    result.push(match[0])
    match = regex.exec(input)
  }
  return result
}

const linesNums = lines.map(line => {
  const matches = matchOverlap(line, numRegex)
  const firstMatch = matches[0]
  const firstNum = strToNum[firstMatch] ?? Number(firstMatch)
  const lastMatch = matches[matches.length - 1]
  const lastNum = strToNum[lastMatch] ?? Number(lastMatch)
  return Number(`${firstNum}${lastNum}`)
})

const sum = linesNums.reduce((acc, cur) => acc + cur, 0)

console.log(sum)
