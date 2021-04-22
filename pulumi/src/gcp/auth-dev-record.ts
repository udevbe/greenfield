import * as gcp from '@pulumi/gcp'
import { clusterAddress } from './cluster-address'
import { provider } from './provider'
import { zone } from './zone'

export const authDevRecord = new gcp.dns.RecordSet(
  'auth.dev-A-record',
  {
    name: 'auth.dev.greenfield.app.',
    type: 'A',
    managedZone: zone.name,
    rrdatas: [clusterAddress.address],
  },
  {
    dependsOn: [zone, clusterAddress],
    provider,
  },
)
