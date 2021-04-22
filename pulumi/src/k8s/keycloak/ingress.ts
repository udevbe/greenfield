import * as kubernetes from '@pulumi/kubernetes'
import { clusterAddress } from '../../gcp'
import { provider } from '../provider'
import { keycloakManagedCertificate } from './managed-certificate'
import { keykloakNamespace } from './namespace'
import { keycloakService } from './service'
import { stage } from '../../configuration'

export const keycloakIngress = new kubernetes.networking.v1beta1.Ingress(
  `${stage}-keycloak-ingress`,
  {
    apiVersion: 'networking.k8s.io/v1beta1',
    kind: 'Ingress',
    metadata: {
      name: `${stage}-keycloak-ingress`,
      namespace: keykloakNamespace.metadata.name,
      annotations: {
        'kubernetes.io/ingress.global-static-ip-name': clusterAddress.name,
        'networking.gke.io/managed-certificates': keycloakManagedCertificate.metadata.name,
        'kubernetes.io/ingress.class': 'gce',
      },
    },
    spec: {
      backend: {
        serviceName: keycloakService.metadata.name,
        // TODO deduce from service spec?
        servicePort: 8080,
      },
    },
  },
  {
    dependsOn: [keykloakNamespace, keycloakManagedCertificate, clusterAddress, keycloakService],
    provider,
  },
)
