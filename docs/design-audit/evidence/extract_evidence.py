"""Read-only source extraction; writes audit evidence, never website code."""
from pathlib import Path
import cv2, json
from PIL import Image, ImageDraw
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
videos = ['c3cde6a7c5d9a9ce274c76829961baf8.mp4', 'original-548010ec4b37f28a6cda106b2d0a2c31.mp4', 'original-b3ea94313077f4f937ae448155c67f1a.mp4', 'original-b318d1739bb54a75ff286720dcaf087c.mp4']
metadata = []
for n, name in enumerate(videos, 1):
    cap = cv2.VideoCapture(str(ROOT / name))
    fps, count = cap.get(cv2.CAP_PROP_FPS), int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = count / fps
    times = list(range(0, int(duration), 2)) + [round((count-1)/fps, 3)]
    metadata.append(dict(video=n, filename=name, fps=fps, frames=count, duration=duration, width=cap.get(3), height=cap.get(4), sampled_seconds=times))
    cells = []
    for t in times:
        cap.set(cv2.CAP_PROP_POS_MSEC, t*1000)
        ok, frame = cap.read()
        if not ok: continue
        im = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        im.save(OUT / f'v{n}-{t:06.2f}.jpg', quality=88)
        im.thumbnail((480,360))
        cell = Image.new('RGB',(480,390),'#e8e8e8')
        cell.paste(im,(0,25)); ImageDraw.Draw(cell).text((8,6),f'Video {n} | {t:.2f}s',fill='black')
        cells.append(cell)
    for offset in range(0,len(cells),12):
        batch=cells[offset:offset+12]
        sheet=Image.new('RGB',(1440,390*((len(batch)+2)//3)),'white')
        for j,cell in enumerate(batch): sheet.paste(cell,((j%3)*480,(j//3)*390))
        sheet.save(OUT/f'video-{n}-sheet-{offset//12+1}.jpg',quality=90)
    cap.release()
(OUT/'video-metadata.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
for name in ['TIL.pdf','TIL 2.pdf']:
    reader=PdfReader(ROOT/name)
    (OUT/(Path(name).stem+'.txt')).write_text('\n\n'.join(f'--- PAGE {i+1} ---\n{p.extract_text()}' for i,p in enumerate(reader.pages)),encoding='utf-8')
for prefix in ['til','til2']:
    pages=sorted((ROOT/'tmp/pdfs').glob(prefix+'-*.jpg'))
    for offset in range(0,len(pages),6):
        batch=pages[offset:offset+6]; sheet=Image.new('RGB',(1200,570*((len(batch)+2)//3)),'#ccc')
        for j,p in enumerate(batch):
            im=Image.open(p); im.thumbnail((400,540)); sheet.paste(im,((j%3)*400,(j//3)*570+25))
            ImageDraw.Draw(sheet).text(((j%3)*400+5,(j//3)*570+5),p.stem,fill='black')
        sheet.save(OUT/f'{prefix}-pages-{offset+1}-{offset+len(batch)}.jpg',quality=90)
print(json.dumps(metadata,indent=2))
