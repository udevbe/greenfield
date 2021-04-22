import * as k8s from '@pulumi/kubernetes'
import { kubeconfig } from '../gcp'
import { stage } from '../configuration'

export const provider = new k8s.Provider(`${stage}-gcp-k8s-provider`, { kubeconfig })
