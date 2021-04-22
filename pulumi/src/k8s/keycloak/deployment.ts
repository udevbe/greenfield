import * as kubernetes from '@pulumi/kubernetes'
import { provider } from '../provider'
import { bitnamiPostgresql } from './helm/bitnami-postgresql'
import { keykloakNamespace } from './namespace'

export const keycloakDeployment = new kubernetes.apps.v1.Deployment(
  'keycloakKeycloakDeployment',
  {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: 'keycloak',
      namespace: keykloakNamespace.metadata.name,
      labels: {
        app: 'keycloak',
      },
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: 'keycloak',
        },
      },
      template: {
        metadata: {
          labels: {
            app: 'keycloak',
          },
        },
        spec: {
          containers: [
            {
              name: 'keycloak',
              image: 'quay.io/keycloak/keycloak:12.0.4',
              env: [
                {
                  name: 'KEYCLOAK_USER',
                  value: 'admin',
                },
                {
                  name: 'KEYCLOAK_PASSWORD',
                  value: 'sIERfjsi8435',
                },
                {
                  name: 'PROXY_ADDRESS_FORWARDING',
                  value: 'true',
                },
                {
                  name: 'DB_VENDOR',
                  value: 'postgres',
                },
                {
                  name: 'DB_ADDR',
                  value: 'keycloak-db-postgresql',
                },
                {
                  name: 'DB_USER',
                  value: 'postgres',
                },
                {
                  name: 'DB_SCHEMA',
                  value: 'public',
                },
                {
                  name: 'DB_DATABASE',
                  value: 'keycloak',
                },
                {
                  name: 'DB_PASSWORD',
                  valueFrom: {
                    secretKeyRef: {
                      name: 'keycloak-db-postgresql',
                      key: 'postgresql-password',
                    },
                  },
                },
              ],
              ports: [
                {
                  name: 'http',
                  containerPort: 8080,
                },
                {
                  name: 'https',
                  containerPort: 8443,
                },
              ],
              readinessProbe: {
                httpGet: {
                  path: '/auth/realms/master',
                  port: 8080,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    dependsOn: [bitnamiPostgresql, keykloakNamespace],
    provider,
  },
)
