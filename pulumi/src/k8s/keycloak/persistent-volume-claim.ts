import * as kubernetes from '@pulumi/kubernetes'
import { provider } from '../provider'
import { keykloakNamespace } from './namespace'

export const keycloakPersistentVolumeClaim = new kubernetes.core.v1.PersistentVolumeClaim(
  'keycloak_devPersistentVolumeClaim',
  {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      namespace: keykloakNamespace.metadata.name,
      name: 'keycloak-dev',
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      resources: {
        requests: {
          storage: '30Gi',
        },
      },
    },
  },
  {
    dependsOn: [keykloakNamespace],
    provider,
  },
)
