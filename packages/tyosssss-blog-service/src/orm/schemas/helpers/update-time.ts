import { Document } from "mongoose";

export default function updateTime<T extends Document>(doc: T): T {
  if (doc.isNew) {
    doc.createAt = doc.updateAt = new Date();
  } else {
    doc.updateAt = new Date();
  }

  return doc;
}
