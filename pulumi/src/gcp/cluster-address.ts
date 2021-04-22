import * as gcp from '@pulumi/gcp'
import { provider } from './provider'

export const clusterAddress = new gcp.compute.GlobalAddress(
  'greenfield-dev-pub',
  {
    name: 'greenfield-dev-pub',
  },
  {
    provider,
  },
)
