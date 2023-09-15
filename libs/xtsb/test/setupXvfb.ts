import { ChildProcessWithoutNullStreams, execSync, spawn } from 'child_process'
import { closeSync, mkdtempSync, openSync, rmdir, rmdirSync } from 'fs'
import * as os from 'os'
import { sep } from 'path'

const tmpDir = os.tmpdir()

const cleanExit = function() {
  process.exit()
}
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill

export async function setupXvfb(display: string): Promise<{ xProc: ChildProcessWithoutNullStreams, xAuthority: string }> {
  const tempDir = mkdtempSync(`${tmpDir}${sep}Xauthority-test-Xvfb`)
  const xAuthority = `${tempDir}/XAuthority`
  closeSync(openSync(xAuthority, 'w'))
  execSync(`xauth add ${display} . $(mcookie)`, {
    env: {
      ...process.env,
      'XAUTHORITY': `${xAuthority}`
    }
  })
  const xProc = spawn('Xvfb', ['-auth', xAuthority, display])
  xProc.on('exit', () => {
    rmdirSync(tempDir, { recursive: true })
  })

  // make sure we kill xvfb if node is killed
  process.on('exit', () => {
    xProc.kill('SIGINT')
  })
  await new Promise(resolve => setTimeout(() => {
    resolve(xProc)
  }, 750))

  return { xProc, xAuthority }
}
