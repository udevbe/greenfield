import * as k8s from '@pulumi/kubernetes'
import { authDevRecord } from '../../gcp'
import { provider } from '../provider'
import { keykloakNamespace } from './namespace'

export const keycloakManagedCertificate = new k8s.apiextensions.CustomResource(
  'keycloakcert',
  {
    apiVersion: 'networking.gke.io/v1',
    kind: 'ManagedCertificate',
    metadata: {
      namespace: keykloakNamespace.metadata.name,
      name: 'keycloakcert',
    },
    spec: { domains: ['auth.dev.greenfield.app'] },
  },
  {
    dependsOn: [keykloakNamespace, authDevRecord],
    provider,
  },
)
