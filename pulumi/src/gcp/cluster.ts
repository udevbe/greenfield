import * as gcp from '@pulumi/gcp'
import { provider } from './provider'
import { stage } from '../configuration'

export const cluster = new gcp.container.Cluster(
  `${stage}-cluster`,
  {
    // can't use this for now: https://github.com/pulumi/pulumi-gcp/issues/560
    // enableAutopilot: true,
    initialNodeCount: 1,
    location: 'europe-west2-b',
    masterAuthorizedNetworksConfig: {
      cidrBlocks: [
        {
          cidrBlock: '81.83.183.66/32',
          displayName: 'Erik',
        },
        {
          cidrBlock: '81.83.112.160/32',
          displayName: 'Peter',
        },
      ],
    },
  },
  {
    provider,
  },
)
