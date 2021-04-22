import * as k8s from '@pulumi/kubernetes'
import { provider } from '../../provider'
import { keykloakNamespace } from '../namespace'

export const bitnamiPostgresql = new k8s.helm.v3.Chart(
  'keycloak-db',
  {
    chart: 'postgresql',
    namespace: keykloakNamespace.metadata.name,
    fetchOpts: {
      repo: 'https://charts.bitnami.com/bitnami',
    },
    values: {
      postgresqlDatabase: 'keycloak',
    },
  },
  {
    provider,
  },
)
