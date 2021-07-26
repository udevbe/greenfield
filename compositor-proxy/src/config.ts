import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import { Configschema } from './@types/config'

import configschema from './configschema.json'

const ajv = new Ajv()
addFormats(ajv)

const validate = ajv.compile(configschema)

const configLocation = process.env.CONFIG ?? path.join(__dirname, 'config.yaml')
console.log(`Reading configuration from: ${configLocation}`)

const configFileContents = fs.readFileSync(configLocation, 'utf8')

const rawConfig = yaml.load(configFileContents)
const isValid = validate(rawConfig)
if (!isValid) {
  throw new Error(`Error validating configuration: ${JSON.stringify(validate.errors)}`)
}

export const config: Configschema = rawConfig as Configschema
