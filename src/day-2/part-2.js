import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const lines = input.split('\r\n')

const games = lines.map(line => {
  const [gameName, sets] = line.split(': ')
  return [Number(gameName.replace('Game ', '')), sets.split('; ')]
})

const gamesTupples = games.map(([, sets]) => {
  return sets.flatMap(set => {
    return set.split(', ').map(cube => {
      const [quantity, color] = cube.match(/^[0-9]+|(red|green|blue)$/g)
      return [color, Number(quantity)]
    })
  })
})

const gamesMinValues = gamesTupples.map((gameTupples) => {
  const minValues = {}
  for (const [color, quantity] of gameTupples) {
    minValues[color] ??= quantity
    if (minValues[color] < quantity) minValues[color] = quantity
  }
  return minValues
})

const result = gamesMinValues.reduce(
  (acc, gameMinValues) => {
    const gamePower = Object.values(gameMinValues).reduce((accPower, minValue) => accPower * minValue, 1)
    return acc + gamePower
  }, 0
)

console.log(result)
