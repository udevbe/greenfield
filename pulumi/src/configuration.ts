import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()
export const stage: 'demo' | 'dev' = config.require('stage')
export const authDomain = config.require('auth-domain')
export const zoneDnsName = config.require('zone-dns-name')
export const authUser = config.require('auth-user')
export const authPassword = config.getSecret('auth-password')
