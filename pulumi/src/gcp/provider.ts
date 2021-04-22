import { Provider } from '@pulumi/gcp'

import { zone, project, region } from './configuration'
import { stage } from '../configuration'

export const provider = new Provider(`${stage}-gcp-provider`, {
  project,
  region,
  zone,
})
