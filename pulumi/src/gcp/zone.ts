import * as gcp from '@pulumi/gcp'
import { provider } from './provider'

import { stage, zoneDnsName } from '../configuration'

export const zone = new gcp.dns.ManagedZone(
  `${stage}-managed-zone`,
  {
    name: `${stage}greenfieldapp`,
    description: `Dns managed zone for stage: ${stage}`,
    dnsName: `${zoneDnsName}.`,
    visibility: 'public',
  },
  {
    provider,
    protect: true,
  },
)
