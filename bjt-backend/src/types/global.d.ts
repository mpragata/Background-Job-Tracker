import { Db } from "mongodb";

declare global {
  var db: Db;
}
