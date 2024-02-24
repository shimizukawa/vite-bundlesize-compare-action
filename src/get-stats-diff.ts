import type {StatsAsset} from 'webpack'
import {assetNameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getStatsDiff(
  oldAssetStats: StatsAsset[],
  newAssetStats: StatsAsset[]
): WebpackStatsDiff {
  return webpackStatsDiff(
    assetNameToSizeMap(oldAssetStats),
    assetNameToSizeMap(newAssetStats)
  )
}
