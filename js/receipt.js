/* =====================================================
   CREATIVE JEWELLERY — receipt.js
   PDF Receipt generation using jsPDF (CDN)
   Depends on: jsPDF loaded via CDN in payment.html
   ===================================================== */

function generateReceipt(order) {
  // Wait for jsPDF to be available
  if (typeof window.jspdf === 'undefined') {
    console.warn('jsPDF not loaded yet, retrying...');
    setTimeout(() => generateReceipt(order), 500);
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const gold   = [180, 145, 30];
  const black  = [17, 17, 17];
  const gray   = [80, 80, 80];
  const silver = [230, 230, 230];
  const white  = [255, 255, 255];
  const green  = [39, 174, 96];

  const pageW  = 210;
  const margin = 18;
  let y        = 0;

  /* ── Header Band ─────────────────────────────── */
  doc.setFillColor(...black);
  doc.rect(0, 0, pageW, 42, 'F');

  // Gold accent line
  doc.setFillColor(...gold);
  doc.rect(0, 42, pageW, 2, 'F');

  // Brand name
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CREATIVE JEWELLERY', pageW / 2, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text('Crafted with Love since 1954  •  Mumbai, India', pageW / 2, 26, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('hello@creativejewellery.in  •  +91 98765 43210', pageW / 2, 33, { align: 'center' });

  y = 52;

  /* ── Receipt Title ───────────────────────────── */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...black);
  doc.text('RECEIPT', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(`Receipt No: #${order.receiptNo}`, pageW - margin, y, { align: 'right' });

  y += 6;
  doc.text(`Date: ${order.date}`, pageW - margin, y, { align: 'right' });

  // Divider
  y += 6;
  doc.setDrawColor(...silver);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageW - margin, y);

  /* ── Customer Info ───────────────────────────── */
  y += 10;
  doc.setFillColor(248, 246, 240);
  doc.roundedRect(margin, y - 5, pageW - margin * 2, 34, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text('CUSTOMER DETAILS', margin + 5, y + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...black);
  doc.text(`Name:    ${order.customer.name}`,    margin + 5, y + 10);
  doc.text(`Email:   ${order.customer.email}`,   margin + 5, y + 17);
  doc.text(`Phone:   ${order.customer.phone}`,   margin + 5, y + 24);

  const addressLines = doc.splitTextToSize(`Address: ${order.customer.address}`, 85);
  doc.text(addressLines, pageW / 2 + 5, y + 10);

  y += 44;

  /* ── Items Table Header ──────────────────────── */
  doc.setFillColor(...black);
  doc.roundedRect(margin, y, pageW - margin * 2, 9, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...white);
  doc.text('PRODUCT',           margin + 4,    y + 6);
  doc.text('QTY',               pageW - 90,    y + 6, { align: 'center' });
  doc.text('UNIT PRICE',        pageW - 60,    y + 6, { align: 'center' });
  doc.text('SUBTOTAL',          pageW - margin - 2, y + 6, { align: 'right' });

  y += 12;

  /* ── Items Rows ──────────────────────────────── */
  let subtotal = 0;
  order.items.forEach((item, idx) => {
    const qty  = item.quantity || 1;
    const sub  = item.price * qty;
    subtotal  += sub;

    const rowBg = idx % 2 === 0 ? [255, 255, 255] : [250, 248, 244];
    doc.setFillColor(...rowBg);
    doc.rect(margin, y - 4, pageW - margin * 2, 9, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...black);

    const itemName = doc.splitTextToSize(item.name, 75);
    doc.text(itemName,                        margin + 4,    y + 1);
    doc.text(String(qty),                     pageW - 90,    y + 1, { align: 'center' });
    doc.text(`$${item.price.toFixed(2)}`,     pageW - 60,    y + 1, { align: 'center' });
    doc.text(`$${sub.toFixed(2)}`,            pageW - margin - 2, y + 1, { align: 'right' });

    y += 10;
  });

  /* ── Totals ──────────────────────────────────── */
  y += 3;
  doc.setDrawColor(...silver);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  const totalsX = pageW - 65;

  // Subtotal row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('Subtotal:',        totalsX, y);
  doc.text(`$${subtotal.toFixed(2)}`, pageW - margin - 2, y, { align: 'right' });
  y += 7;

  doc.text('Shipping:',        totalsX, y);
  doc.setTextColor(...green);
  doc.text('FREE',             pageW - margin - 2, y, { align: 'right' });
  y += 7;

  doc.text('Payment Method:',  totalsX, y);
  doc.setTextColor(...black);
  doc.text(order.payment || 'N/A', pageW - margin - 2, y, { align: 'right' });
  y += 4;

  // Grand total band
  doc.setFillColor(...gold);
  doc.roundedRect(totalsX - 5, y, (pageW - margin) - (totalsX - 5), 11, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...black);
  doc.text('TOTAL:',                totalsX, y + 7.5);
  doc.text(`$${order.total.toFixed(2)}`, pageW - margin - 2, y + 7.5, { align: 'right' });

  y += 20;

  /* ── Status Badge ────────────────────────────── */
  doc.setFillColor(...green);
  doc.roundedRect(margin, y - 4, 42, 10, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...white);
  doc.text('✓ PAID', margin + 21, y + 2.5, { align: 'center' });

  y += 14;

  /* ── Footer ──────────────────────────────────── */
  doc.setFillColor(...black);
  doc.rect(0, 275, pageW, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...gold);
  doc.text('Thank You For Shopping With Us!', pageW / 2, 283, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Visit Again ❤️  •  www.creativejewellery.in', pageW / 2, 290, { align: 'center' });

  /* ── Download ────────────────────────────────── */
  doc.save(`Receipt_${order.receiptNo}.pdf`);
}

window.generateReceipt = generateReceipt;
