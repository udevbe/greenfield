import * as gcp from '@pulumi/gcp'
import { Output } from '@pulumi/pulumi'
import * as fs from 'fs'
import * as path from 'path'

import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'

const cosGpuInstallerDir = 'cos-gpu-installer'

async function prepare() {
  if (!fs.existsSync(path.resolve(__dirname, cosGpuInstallerDir))) {
    const options: SimpleGitOptions = {
      baseDir: __dirname,
      binary: 'git',
      maxConcurrentProcesses: 6
    }
    const git: SimpleGit = simpleGit(options)
    await git.clone('git@github.com:udevbe/cos-gpu-installer.git', 'cos-gpu-installer', {
      '--branch': 'master',
      '--single-branch': null,
      '--depth': '1'
    })
  }
}

function build() {
  const computeNetwork = new gcp.compute.Network('network')
  const computeFirewall = new gcp.compute.Firewall('firewall', {
    network: computeNetwork.id,
    allows: [{
      protocol: 'tcp',
      ports: ['22', '443', '8081']
    }]
  })

  const computeInstance = new gcp.compute.Instance('app-endpoint-host', {
    machineType: 'n1-standard-8',
    zone: 'europe-west2-b',
    enableDisplay: true,
    guestAccelerators: [{
      count: 1,
      type: 'nvidia-tesla-t4'
    }],
    bootDisk: {
      autoDelete: true,
      initializeParams: {
        image: 'cos-cloud/cos-stable-85-13310-1209-3',
        size: 30
      }
    },
    networkInterfaces: [{
      'network': computeNetwork.id,
      'accessConfigs': [{}]
    }],
    scheduling: {
      'preemptible': true,
      'onHostMaintenance': 'TERMINATE',
      'automaticRestart': false,
      'nodeAffinities': []
    },
    allowStoppingForUpdate: true,
    metadata: {
      'cos-gpu-installer-env': fs.readFileSync(path.resolve(__dirname, cosGpuInstallerDir, 'scripts', 'gpu-installer-env'), 'utf8'),
      'user-data': fs.readFileSync(path.resolve(__dirname, cosGpuInstallerDir, 'install-test-gpu.cfg'), 'utf8'),
      'run-installer-script': fs.readFileSync(path.resolve(__dirname, cosGpuInstallerDir, 'scripts', 'run_installer.sh'), 'utf8'),
      'run-cuda-test-script': fs.readFileSync(path.resolve(__dirname, cosGpuInstallerDir, 'scripts', 'run_cuda_test.sh'), 'utf8')
    },
    serviceAccount: {
      email: gcp.compute.getDefaultServiceAccount().then(account => account.email),
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform'
      ]
    }
  })

  return {
    computeInstance
  }
}

async function main() {
  await prepare()
  return build()
}

const computeInstancePromise = main()

export const instanceName: Promise<Output<string>> = computeInstancePromise.then(({ computeInstance }) => computeInstance.name)
export const instanceIP: Promise<Output<string | undefined>> = computeInstancePromise.then(({ computeInstance }) => computeInstance.networkInterfaces.apply(ni => ni[0]?.accessConfigs?.[0].natIp))
