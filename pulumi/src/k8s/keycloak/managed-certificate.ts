import * as k8s from '@pulumi/kubernetes'
import { provider } from '../provider'
import { keykloakNamespace } from './namespace'
import { authDomain, stage } from '../../configuration'

export const keycloakManagedCertificate = new k8s.apiextensions.CustomResource(
  `${stage}-keycloakcert`,
  {
    apiVersion: 'networking.gke.io/v1',
    kind: 'ManagedCertificate',
    metadata: {
      namespace: keykloakNamespace.metadata.name,
      name: `${stage}-keycloakcert`,
    },
    spec: { domains: [authDomain] },
  },
  {
    dependsOn: [keykloakNamespace],
    provider,
  },
)
