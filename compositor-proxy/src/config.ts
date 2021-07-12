import yaml from 'js-yaml'
import fs from 'fs'
// Get document, or throw exception on error

const configLocation = process.env.CONFIG ?? 'config.yaml'

export const config = yaml.load(fs.readFileSync(configLocation, 'utf8'))
