import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()

export const project = config.require('gcp-project')
export const region = config.require('gcp-region')
export const zone = config.require('gcp-zone')
