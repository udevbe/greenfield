import * as kubernetes from '@pulumi/kubernetes'
import { clusterAddress } from '../../gcp'
import { provider } from '../provider'
import { keycloakManagedCertificate } from './managed-certificate'
import { keykloakNamespace } from './namespace'

export const keycloakIngress = new kubernetes.networking.v1beta1.Ingress(
  'keycloakIngress',
  {
    apiVersion: 'networking.k8s.io/v1beta1',
    kind: 'Ingress',
    metadata: {
      name: 'keycloak',
      namespace: keykloakNamespace.metadata.name,
      annotations: {
        'kubernetes.io/ingress.global-static-ip-name': 'greenfield-dev-pub',
        'networking.gke.io/managed-certificates': 'keycloakcert',
        'kubernetes.io/ingress.class': 'gce',
      },
    },
    spec: {
      backend: {
        serviceName: 'keycloak',
        servicePort: 8080,
      },
    },
  },
  {
    dependsOn: [keykloakNamespace, keycloakManagedCertificate, clusterAddress],
    provider,
  },
)
