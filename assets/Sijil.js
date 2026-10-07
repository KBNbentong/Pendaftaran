// Shared certificate generator (used by index.html and winner.html)
// mm values are measured from the top edge of the page
const SIJIL = { url:'assets/sijil-template.jpg', nameYmm:97, icGapMm:8, size:18, maxWmm:170 };
const mm = v => v*72/25.4;

async function muatTurunSijil(nama, kp){
  const res = await fetch(SIJIL.url); if(!res.ok) throw new Error('template');
  const doc = await PDFLib.PDFDocument.create();
  const img = await doc.embedJpg(await res.arrayBuffer());
  const land = img.width > img.height;
  const W = land ? 841.89 : 595.28, H = land ? 595.28 : 841.89;   // A4 in points
  const page = doc.addPage([W, H]);
  page.drawImage(img, { x:0, y:0, width:W, height:H });
  const font = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
  const nm = nama.toUpperCase().replace(/[^\x20-\x7E]/g,'').trim();
  const ic = `(${kp.slice(0,6)}-${kp.slice(6,8)}-${kp.slice(8)})`;
  const draw = (t, yMm)=>{
    let s = SIJIL.size;
    while(s>12 && font.widthOfTextAtSize(t,s) > mm(SIJIL.maxWmm)) s--;
    const w = font.widthOfTextAtSize(t,s);
    page.drawText(t,{x:(W-w)/2, y:H-mm(yMm), size:s, font, color:PDFLib.rgb(0,0,0)});
  };
  draw(nm, SIJIL.nameYmm);
  draw(ic, SIJIL.nameYmm + SIJIL.icGapMm);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([await doc.save()],{type:'application/pdf'}));
  a.download = 'Sijil-HSN2026-'+kp+'.pdf'; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000);
}
