import * as k8s from '@pulumi/kubernetes'
import { provider } from '../provider'

export const keykloakNamespace = new k8s.core.v1.Namespace('keycloak', {}, { provider })
