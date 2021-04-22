import * as kubernetes from '@pulumi/kubernetes'
import { provider } from '../provider'
import { keykloakNamespace } from './namespace'

import { stage } from '../../configuration'

export const keycloakService = new kubernetes.core.v1.Service(
  `${stage}-keycloak`,
  {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: 'keycloak',
      namespace: keykloakNamespace.metadata.name,
      labels: {
        app: 'keycloak',
      },
    },
    spec: {
      ports: [
        {
          name: 'http',
          port: 8080,
          targetPort: 8080,
        },
      ],
      selector: {
        app: 'keycloak',
      },
      type: 'NodePort',
    },
  },
  {
    dependsOn: [keykloakNamespace],
    provider,
  },
)
