import * as gcp from '@pulumi/gcp'
import { authDomain, stage } from '../configuration'
import { clusterAddress } from './cluster-address'
import { provider } from './provider'
import { zone } from './zone'

export const authRecord = new gcp.dns.RecordSet(
  `${stage}-auth-record`,
  {
    name: `${authDomain}.`,
    type: 'A',
    ttl: 3600,
    managedZone: zone.name,
    rrdatas: [clusterAddress.address],
  },
  {
    dependsOn: [zone, clusterAddress],
    provider,
  },
)
