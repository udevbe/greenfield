import * as k8s from '@pulumi/kubernetes'
import { kubeconfig } from '../gcp'

export const provider = new k8s.Provider('gkeK8s', { kubeconfig })
