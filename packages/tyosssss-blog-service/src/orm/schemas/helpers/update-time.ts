import { blog } from "../../../../typings/tyosssss-blog";

export default function updateTime<T extends blog.document.BaseDocument>(
  doc: T
): T {
  if (doc.isNew) {
    doc.createAt = doc.updateAt = new Date();
  } else {
    doc.updateAt = new Date();
  }

  return doc;
}
