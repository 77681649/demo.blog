export default function fixXSS(content: string): string {
  content = String(content);

  // 过滤掉 <script> ... </script>
  content = content.replace(/(<script>.+<\/script>)/g, "");

  return content;
}
