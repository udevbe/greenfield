import * as gcp from '@pulumi/gcp'
import { provider } from './provider'

export const zone = new gcp.dns.ManagedZone(
  'greenfield-dev-zone',
  {
    name: 'devgreenfieldapp',
    description: 'dev.greenfield.app',
    dnsName: 'dev.greenfield.app.',
    visibility: 'public',
  },
  {
    provider,
  },
)
