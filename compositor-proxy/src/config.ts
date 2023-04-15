import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import { Configschema } from './@types/config'

import configschema from './configschema.json'
import { args } from './Args'
import Logger from 'pino'

const logger = Logger({
  name: 'config',
})

const ajv = new Ajv()
addFormats(ajv)

const validate = ajv.compile(configschema)

let configPath = args['config-path']
if (configPath) {
  logger.info(`Reading configuration from: ${configPath}`)
} else {
  logger.info('Using build-in default configuration')
  configPath = path.join(__dirname, 'config.yaml')
}

const configFileContents = fs.readFileSync(configPath, 'utf8')

const rawConfig = yaml.load(configFileContents)
const isValid = validate(rawConfig)
if (!isValid) {
  throw new Error(`Error validating configuration: ${JSON.stringify(validate.errors)}`)
}

export const config: Configschema = rawConfig as unknown as Configschema
