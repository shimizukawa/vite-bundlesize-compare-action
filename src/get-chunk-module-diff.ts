import type {StatsAsset, StatsCompilation} from 'webpack'
import {chunkModuleNameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getChunkModuleDiff(
  oldStats: StatsAsset[],
  newStats: StatsAsset[],
): WebpackStatsDiff | null {
  if (!oldStats || !newStats) {
    return null
  }
  return webpackStatsDiff(
    chunkModuleNameToSizeMap(oldStats),
    chunkModuleNameToSizeMap(newStats)
  )
}
