/**
 * This file is to deal with the `Method Map.prototype.set called on incompatible receiver #<Map>`
 * issue when calling `MikroORM.init()` from within setup-global.jest.ts.
 *
 * Big thanks to the article below.
 * @see https://docs.medusajs.com/resources/troubleshooting/test-errors
 */
import { MetadataStorage } from "@mikro-orm/core";

MetadataStorage.clear();