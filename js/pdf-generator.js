/* =========================================================
   InterviewForge — pdf-generator.js
   Generates a branded, paginated PDF of a category's
   questions & answers using jsPDF (loaded from CDN on demand).
   ========================================================= */

const PDF_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
let _jsPDFLoading = null;

function ensureJsPDF() {
  if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve();
  if (_jsPDFLoading) return _jsPDFLoading;
  _jsPDFLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PDF_CDN_URL;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load PDF engine'));
    document.head.appendChild(script);
  });
  return _jsPDFLoading;
}

/**
 * Generates and downloads a PDF for a list of Q&A items.
 * @param {Object} config
 * @param {string} config.categoryName - e.g. "Java Interview Questions"
 * @param {Array}  config.items - array of question objects (title/answer/example/etc.)
 * @param {string} [config.fileName] - download filename
 */
async function downloadCategoryPDF(config) {
  const btn = config.triggerButton;
  const originalLabel = btn ? btn.innerHTML : null;
  if (btn) { btn.innerHTML = 'Preparing PDF…'; btn.disabled = true; }

  try {
    await ensureJsPDF();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const BRAND = '#4F46E5';
    const INK = '#0F172A';
    const SLATE = '#64748B';

    function addFooter(pageNum) {
      doc.setFontSize(8.5);
      doc.setTextColor(SLATE);
      doc.text('InterviewForge · interviewforge.example.com', margin, pageHeight - 24);
      doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 24, { align: 'right' });
    }

    function newPageIfNeeded(neededHeight) {
      if (y + neededHeight > pageHeight - 60) {
        addFooter(doc.internal.getNumberOfPages());
        doc.addPage();
        y = margin;
      }
    }

    // ---------- Cover / Header block ----------
    doc.setFillColor(BRAND);
    doc.rect(0, 0, pageWidth, 96, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('InterviewForge', margin, 46);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Crack Your Dream IT Job Interview', margin, 66);
    y = 130;

    doc.setTextColor(INK);
    doc.setFontSize(17);
    doc.setFont(undefined, 'bold');
    doc.text(config.categoryName, margin, y);
    y += 18;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(SLATE);
    doc.text(`${config.items.length} Questions & Answers · Generated ${new Date().toLocaleDateString()}`, margin, y);
    y += 26;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;

    // ---------- Table of contents ----------
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(INK);
    doc.text('Table of Contents', margin, y);
    y += 18;
    doc.setFontSize(9.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(SLATE);
    config.items.forEach((item, i) => {
      newPageIfNeeded(16);
      const line = `${i + 1}. ${item.title}`;
      const wrapped = doc.splitTextToSize(line, contentWidth);
      doc.text(wrapped[0], margin, y);
      y += 14;
    });

    addFooter(doc.internal.getNumberOfPages());
    doc.addPage();
    y = margin;

    // ---------- Questions & Answers ----------
    config.items.forEach((item, i) => {
      newPageIfNeeded(70);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(BRAND);
      const qLine = `Q${i + 1}. ${item.title}`;
      const qWrapped = doc.splitTextToSize(qLine, contentWidth);
      doc.text(qWrapped, margin, y);
      y += qWrapped.length * 14 + 4;

      if (item.difficulty) {
        doc.setFontSize(8.5);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(SLATE);
        doc.text(`Difficulty: ${item.difficulty}`, margin, y);
        y += 14;
      }

      if (item.answer) {
        newPageIfNeeded(30);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(INK);
        const ansWrapped = doc.splitTextToSize(item.answer, contentWidth);
        ansWrapped.forEach(line => {
          newPageIfNeeded(14);
          doc.text(line, margin, y);
          y += 13.5;
        });
      }

      if (item.example) {
        newPageIfNeeded(24);
        y += 4;
        doc.setFontSize(9);
        doc.setFont('courier', 'normal');
        doc.setTextColor('#334155');
        const exWrapped = doc.splitTextToSize(item.example, contentWidth);
        exWrapped.forEach(line => {
          newPageIfNeeded(13);
          doc.text(line, margin, y);
          y += 12;
        });
        doc.setFont(undefined, 'normal');
      }

      y += 18;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y - 9, pageWidth - margin, y - 9);
    });

    addFooter(doc.internal.getNumberOfPages());

    const fileName = config.fileName || (config.categoryName.replace(/\s+/g, '_') + '.pdf');
    doc.save(fileName);
    if (typeof showToast === 'function') showToast('PDF downloaded successfully');
  } catch (err) {
    console.error(err);
    if (typeof showToast === 'function') showToast('Could not generate PDF — please try again');
  } finally {
    if (btn) { btn.innerHTML = originalLabel; btn.disabled = false; }
  }
}
