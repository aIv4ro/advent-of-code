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

const getLocation = (seed) => {
  return mapsKeys.reduce((acc, cur) => {
    return rangeFinder(maps[cur], acc ?? seed)
  }, null)
}

// for each seed
const minLocInPair = []
for (let i = 0; i < seeds.length; i += 2) {
  const [seed1, seed2] = [seeds[i], seeds[i] + seeds[i + 1] - 1]

  let minLoc = Infinity
  let minLocSeed = seed1
  for (let i = seed1; i <= seed2; i += 50000) {
    const loc = getLocation(i)
    if (loc < minLoc) {
      minLoc = loc
      minLocSeed = i
    }
  }

  minLocInPair.push([minLoc, minLocSeed, seed1, seed2])
}

// get the min seed
let minLoc = Infinity
let range = [0, 0, 0]
// foor
for (const [loc, seed, seed1, seed2] of minLocInPair) {
  if (loc < minLoc) {
    minLoc = loc
    range = [seed, seed1, seed2]
  }
}

// look +- 10000 from the min seed
const delta = 25000
const minSearch = Math.max(range[0] - delta, range[1])
const maxSearch = Math.min(range[0] + delta, range[2])

let minLocSeed = minSearch
let minLocSeedLoc = Infinity
for (let i = minSearch; i <= maxSearch; i++) {
  const loc = getLocation(i)
  if (loc < minLocSeedLoc) {
    minLocSeedLoc = loc
    minLocSeed = i
  }
}

console.log(getLocation(minLocSeed))
