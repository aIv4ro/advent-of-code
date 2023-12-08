import { readFile } from 'node:fs/promises'

const path = new URL('input.txt', import.meta.url)
const input = await readFile(path).then(res => res.toString())
const [seedsLine,, ...mapsLines] = input.split('\r\n')
const seeds = seedsLine.match(/\d+/g).map(Number)

const maps = {}
let curKey = null
let curValue = []
for (const mapLine of mapsLines) {
  if (mapLine.match(/map:$/) != null) {
    curKey = mapLine.replace(' map:', '')
  } else if (mapLine === '') {
    maps[curKey] = curValue
    curKey = null
    curValue = []
  } else {
    const { value } = mapLine.matchAll(/(\d+)\s(\d+)\s(\d+)/g).next()
    curValue.push(value.slice(1, 4).map(Number))
  }
}

if (curKey != null) {
  maps[curKey] = curValue
}

const rangeFinder = (ranges, value) => {
  const range = ranges.find(([, sStart, length]) => sStart <= value && sStart + length >= value)
  if (range == null) return value
  const rangeIndex = value - range[1]
  return range[0] + rangeIndex
}

const mapsKeys = [
  'seed-to-soil', 'soil-to-fertilizer', 'fertilizer-to-water', 'water-to-light',
  'light-to-temperature', 'temperature-to-humidity', 'humidity-to-location'
]

const locations = seeds.map(seed => {
  return mapsKeys.reduce((acc, cur) => {
    return rangeFinder(maps[cur], acc ?? seed)
  }, null)
})

const result = Math.min(...locations.map(Number))

console.log(result) // 322500873
