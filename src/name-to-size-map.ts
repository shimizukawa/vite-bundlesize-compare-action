import type {StatsAsset} from 'webpack'
import type {Sizes} from './types'

type StatsGroup = {
  label?: string
  statSize?: number
  groups?: StatsGroup[]
}
type Stat = [
  label: string,
  {
    size: number
    gzipSize: number | null
  }
]

function formatLabel(label: string): string {
  // labelから除去する: ?<query>
  label = label.split('?')[0]

  // mermaid関連の、ファイル名に含まれるハッシュ値を置換する
  label = label.replace(/([^/]+)-[\da-f]+\b/, '$1-[hash]')

  return label
}

// groups以下のstatsを列挙
function collectStatsInGroup(group: StatsGroup): Stat[] {
  // If a module doesn't have any submodules beneath it, then just return its own size
  // Otherwise, break each module into its submodules with their own sizes
  if (!group.groups) {
    return [
      [
        formatLabel(group.label ?? ''),
        {
          size: group.statSize ?? 0,
          gzipSize: null
        }
      ]
    ]
  } else {
    return (
      group.groups.flatMap((subgroup: StatsGroup) =>
        collectStatsInGroup(subgroup)
      ) ?? []
    )
  }
}

function formatAssetName(label: string): string {
  // ファイル名に含まれるbase64を置換する: .[base64].min.js
  const name = label.replace(/\.([\d\w_-]+)(\.min\.js)$/, '.[base64]$2')
  return formatLabel(name)
}

export function assetNameToSizeMap(
  statsAssets: StatsAsset[] = []
): Map<string, Sizes> {
  return new Map(
    statsAssets.map(asset => {
      return [
        formatAssetName(asset.label),
        {
          size: asset.parsedSize,
          gzipSize: asset.gzipSize
        }
      ]
    })
  )
}

export function chunkModuleNameToSizeMap(
  statsAssets: StatsAsset[] = []
): Map<string, Sizes> {
  return new Map(
    statsAssets.flatMap(chunk => {
      if (!chunk.stats) return []
      return chunk.stats.flatMap((stat: StatsGroup) => {
        return collectStatsInGroup(stat)
      })
    })
  )
}
