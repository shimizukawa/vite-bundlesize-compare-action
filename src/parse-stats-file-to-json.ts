import {createReadStream} from 'fs'
import {resolve} from 'path'
import {parseChunked} from '@discoveryjs/json-ext'
import type {StatsAsset} from 'webpack'
import * as core from '@actions/core'

export async function parseStatsFileToJson(
  statsFilePath: string
): Promise<StatsAsset[]> {
  try {
    const path = resolve(process.cwd(), statsFilePath)
    return (await parseChunked(createReadStream(path))) as StatsAsset[]
  } catch (error) {
    if (error instanceof Error) {
      core.warning(error)
    }
    return [] as StatsAsset[]
  }
}
