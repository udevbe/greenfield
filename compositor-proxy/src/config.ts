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

let configLocation = args['config-location']
if (configLocation) {
  logger.info(`Reading configuration from: ${configLocation}`)
} else {
  logger.info('Using build-in default configuration')
  configLocation = path.join(__dirname, 'config.yaml')
}

const configFileContents = fs.readFileSync(configLocation, 'utf8')

const rawConfig = yaml.load(configFileContents)
const isValid = validate(rawConfig)
if (!isValid) {
  throw new Error(`Error validating configuration: ${JSON.stringify(validate.errors)}`)
}

export const config: Configschema = rawConfig as unknown as Configschema
