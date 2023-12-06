import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const scratchCards = input.split('\r\n')

const cardPoints = scratchCards.map(scratchCard => {
  const [winningNumbers, numbers] = scratchCard
    .split(/Card [0-9]+:\s+|\s+\|\s+/g)
    .filter(Boolean)
    .map(nums => nums.split(/\s+/).map(Number))

  return numbers
    .filter(number => winningNumbers.includes(number))
    .reduce((acc, _, index) => {
      return index === 0 ? 1 : acc * 2
    }, 0)
})

const result = cardPoints.reduce((acc, cur) => acc + cur, 0)

console.log(result) // 23941
