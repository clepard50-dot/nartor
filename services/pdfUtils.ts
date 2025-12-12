// We access the global pdfjsLib injected via script tag in index.html
// This avoids complex build configuration for the worker in this specific environment.
declare const pdfjsLib: any;

export const loadPDF = async (file: File): Promise<any> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  return await loadingTask.promise;
};

export const extractTextFromPages = async (
  pdfDoc: any,
  startPage: number,
  endPage: number
): Promise<string> => {
  let fullText = '';
  
  // Validate range
  const start = Math.max(1, startPage);
  const end = Math.min(pdfDoc.numPages, endPage);

  for (let i = start; i <= end; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += `\n\n--- Page ${i} ---\n\n${pageText}`;
  }

  return fullText;
};
