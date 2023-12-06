import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const scratchCards = input.split('\r\n')

const cardsCopies = scratchCards.reduce((acc, cur, index) => {
  const [winningNumbers, numbers] = cur
    .split(/Card [0-9]+:\s+|\s+\|\s+/g)
    .filter(Boolean)
    .map(nums => nums.split(/\s+/).map(Number))

  const matchingNumbers = numbers.filter(number => winningNumbers.includes(number)).length
  acc[index] ??= 0
  acc[index] += 1
  for (let j = 0; j < acc[index]; j++) {
    for (let i = 1; i <= matchingNumbers; i++) {
      const copyIndex = index + i
      acc[copyIndex] ??= 0
      acc[copyIndex] += 1
    }
  }
  return acc
}, {})

const result = Object.values(cardsCopies).reduce((acc, cur) => acc + cur, 0)

console.log(result) // 5571760
