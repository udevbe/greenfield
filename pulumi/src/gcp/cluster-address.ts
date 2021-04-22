import * as gcp from '@pulumi/gcp'
import { provider } from './provider'
import { stage } from '../configuration'

export const clusterAddress = new gcp.compute.GlobalAddress(
  `${stage}-greenfield-cluster-address`,
  {
    name: `${stage}-greenfield-cluster-address`,
  },
  {
    provider,
  },
)
