/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path from 'node:path'
import fs from 'node:fs'
import { type Request, type Response, type NextFunction } from 'express'

export function serveQuarantineFiles () {
  return ({ params, query }: Request, res: Response, next: NextFunction) => {
    const file = params.file

    if (!file.includes('/')) {
      const directory = path.resolve('ftp/quarantine/')
      const filePath = path.resolve(directory, file)
      const realDirectory = fs.realpathSync(directory)
      const realFilePath = fs.realpathSync(filePath)
      if (realFilePath.startsWith(`${realDirectory}${path.sep}`)) {
        res.sendFile(realFilePath)
      } else {
        res.status(403)
        next(new Error('File names must resolve within the quarantine directory!'))
      }
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }
}
