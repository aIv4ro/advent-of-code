import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const lines = input.split('\r\n')

const games = lines.map(line => {
  const [gameName, sets] = line.split(': ')
  return [Number(gameName.replace('Game ', '')), sets.split('; ')]
})

const gameRules = {
  red: quantity => quantity <= 12,
  green: quantity => quantity <= 13,
  blue: quantity => quantity <= 14
}

const validGames = games.filter(([id, sets]) => {
  return sets.every(set => {
    return set
      .split(', ')
      .map(cube => {
        const [quantity, color] = cube.match(/^[0-9]+|(red|green|blue)$/g)
        return [color, Number(quantity)]
      })
      .every(([color, quantity]) => {
        return gameRules[color](quantity)
      })
  })
}).reduce((acc, [id]) => acc + id, 0)

console.log(validGames)
