import { Provider } from '@pulumi/gcp'

export const provider = new Provider('greenfield-dev', {
  project: 'greenfield-startup-dev',
  region: 'europe-west2',
  zone: 'europe-west2-b',
})
