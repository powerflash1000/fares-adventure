"""Prepare coloring pages: raw AI line art -> thick transparent-line PNG (1280x960) + QC sheet that tints the outside region.
usage: color_prep.py RAW_DIR OUT_DIR [QC_PNG]"""
import sys, os, glob
import numpy as np, cv2

W, H = 1280, 960
def prep(path):
    g = cv2.imread(path, 0)
    g = cv2.resize(g, (W, H), interpolation=cv2.INTER_AREA)
    ink = np.clip((215 - g.astype(np.float32)) / (215 - 70), 0, 1)       # 0..1 darkness
    ink = cv2.erode(1 - ink, np.ones((3, 3), np.uint8)).astype(np.float32); ink = 1 - ink   # thicken by ~1px/side
    ink = cv2.GaussianBlur(ink, (0, 0), 0.8)
    ink = np.clip(ink * 1.6, 0, 1)
    ink[:6, :] = 0; ink[-6:, :] = 0; ink[:, :6] = 0; ink[:, -6:] = 0      # kill border artefacts
    a = (ink * 255).astype(np.uint8)
    rgba = np.zeros((H, W, 4), np.uint8); rgba[..., 3] = a                # black lines, alpha = ink
    return rgba

def regions(rgba, d=2):
    solid = (rgba[..., 3] > 110).astype(np.uint8)
    solid = cv2.dilate(solid, np.ones((3, 3), np.uint8), iterations=d)
    n, lab = cv2.connectedComponents(1 - solid, connectivity=4)
    return n, lab, solid

def qc(rgba):
    n, lab, solid = regions(rgba)
    bg = lab[10, 10] if solid[10, 10] == 0 else lab[H // 2, 10]
    areas = np.bincount(lab.ravel(), minlength=n); areas[0] = 0
    big = [(i, a) for i, a in enumerate(areas) if i != bg and a > 0.015 * W * H and i != 0]
    bgfrac = areas[bg] / (W * H)
    return n, bgfrac, len(big), lab, bg

def sheet_tile(rgba, lab, bg):
    rgb = np.full((H, W, 3), 255, np.uint8)
    rgb[lab == bg] = (200, 225, 255)                                       # outside tinted
    a = rgba[..., 3:4].astype(np.float32) / 255
    out = (rgb * (1 - a)).astype(np.uint8)
    return cv2.resize(out, (480, 360), interpolation=cv2.INTER_AREA)

if __name__ == '__main__':
    raw, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
    tiles = []
    for p in sorted(glob.glob(os.path.join(raw, '*.png'))):
        name = os.path.basename(p)
        rgba = prep(p)
        n, bgfrac, big, lab, bg = qc(rgba)
        stem = 'shark' + name[:2]
        cv2.imwrite(os.path.join(out, stem + '.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_PNG_COMPRESSION, 9])
        os.makedirs(os.path.join(out, 't'), exist_ok=True)
        th = cv2.resize(255 - rgba[..., 3], (320, 240), interpolation=cv2.INTER_AREA)
        cv2.imwrite(os.path.join(out, 't', stem + '.jpg'), th, [cv2.IMWRITE_JPEG_QUALITY, 82])
        t = sheet_tile(rgba, lab, bg)
        cv2.putText(t, f'{name[:2]} regions={n} bg={bgfrac:.2f} big={big}', (6, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        tiles.append(t); print(name, 'regions', n, 'bg %.2f' % bgfrac, 'big', big)
    if len(sys.argv) > 3 and tiles:
        cols = 4; rows = (len(tiles) + cols - 1) // cols
        sh = np.full((rows * 360, cols * 480, 3), 255, np.uint8)
        for i, t in enumerate(tiles): sh[(i // cols) * 360:(i // cols + 1) * 360, (i % cols) * 480:(i % cols + 1) * 480] = t
        cv2.imwrite(sys.argv[3], sh)
