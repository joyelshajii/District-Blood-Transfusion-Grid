/**
 * High-Precision Mathematical QR Code Generator (ISO/IEC 18004 Standard)
 * Zero external dependencies • Pure TypeScript • SVG Output
 * Supports QR Model 2 (Versions 1-6) with Byte Mode Encoding and Reed-Solomon Error Correction
 */

import React from 'react';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// Galois Field GF(256) Tables with primitive polynomial 0x11D (285)
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x = (x << 1) ^ (x & 0x80 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 255];
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
}

// Reed-Solomon Generator Polynomial
function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const factor = new Uint8Array([1, EXP_TABLE[i]]);
    const newPoly = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      for (let k = 0; k < factor.length; k++) {
        newPoly[j + k] ^= gfMul(poly[j], factor[k]);
      }
    }
    poly = newPoly;
  }
  return poly;
}

// Compute Reed-Solomon error correction codewords
function rsComputeEC(data: Uint8Array, numEC: number): Uint8Array {
  const genPoly = rsGeneratorPoly(numEC);
  const remainder = new Uint8Array(numEC);

  for (let i = 0; i < data.length; i++) {
    const lead = data[i] ^ remainder[0];
    for (let j = 0; j < numEC - 1; j++) {
      remainder[j] = remainder[j + 1] ^ gfMul(genPoly[j + 1], lead);
    }
    remainder[numEC - 1] = gfMul(genPoly[numEC], lead);
  }
  return remainder;
}

// QR Version specification table (Versions 1-6)
interface QRVersionSpec {
  version: number;
  size: number;
  totalDataBytes: Record<ErrorCorrectionLevel, number>;
  ecBytesPerBlock: Record<ErrorCorrectionLevel, number>;
  numBlocks: Record<ErrorCorrectionLevel, number>;
  alignmentPatterns: number[];
}

const QR_SPECS: QRVersionSpec[] = [
  {
    version: 1,
    size: 21,
    totalDataBytes: { L: 19, M: 16, Q: 13, H: 9 },
    ecBytesPerBlock: { L: 7, M: 10, Q: 13, H: 17 },
    numBlocks: { L: 1, M: 1, Q: 1, H: 1 },
    alignmentPatterns: [],
  },
  {
    version: 2,
    size: 25,
    totalDataBytes: { L: 34, M: 28, Q: 22, H: 16 },
    ecBytesPerBlock: { L: 10, M: 16, Q: 22, H: 28 },
    numBlocks: { L: 1, M: 1, Q: 1, H: 1 },
    alignmentPatterns: [6, 18],
  },
  {
    version: 3,
    size: 29,
    totalDataBytes: { L: 55, M: 44, Q: 34, H: 26 },
    ecBytesPerBlock: { L: 15, M: 26, Q: 36, H: 44 },
    numBlocks: { L: 1, M: 1, Q: 2, H: 2 },
    alignmentPatterns: [6, 22],
  },
  {
    version: 4,
    size: 33,
    totalDataBytes: { L: 80, M: 64, Q: 48, H: 36 },
    ecBytesPerBlock: { L: 20, M: 18, Q: 26, H: 16 },
    numBlocks: { L: 1, M: 2, Q: 2, H: 4 },
    alignmentPatterns: [6, 26],
  },
  {
    version: 5,
    size: 37,
    totalDataBytes: { L: 108, M: 86, Q: 62, H: 46 },
    ecBytesPerBlock: { L: 26, M: 24, Q: 18, H: 22 },
    numBlocks: { L: 1, M: 2, Q: 2, H: 4 },
    alignmentPatterns: [6, 30],
  },
  {
    version: 6,
    size: 41,
    totalDataBytes: { L: 136, M: 108, Q: 76, H: 60 },
    ecBytesPerBlock: { L: 18, M: 16, Q: 24, H: 28 },
    numBlocks: { L: 2, M: 4, Q: 4, H: 4 },
    alignmentPatterns: [6, 34],
  },
];

// Format Info format mask: 0x5412 (BCH 15, 5 error correction)
const FORMAT_INFO_STRINGS: Record<ErrorCorrectionLevel, number[]> = {
  L: [0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976],
  M: [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0],
  Q: [0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed],
  H: [0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b],
};

export class QRCode {
  public size: number;
  public matrix: boolean[][];
  private isFunction: boolean[][];

  constructor(size: number) {
    this.size = size;
    this.matrix = Array.from({ length: size }, () => Array(size).fill(false));
    this.isFunction = Array.from({ length: size }, () => Array(size).fill(false));
  }

  public setFunctionModule(r: number, c: number, val: boolean) {
    this.matrix[r][c] = val;
    this.isFunction[r][c] = true;
  }

  public isFunctionModule(r: number, c: number): boolean {
    return this.isFunction[r][c];
  }
}

// Encode text into bits using Byte mode (0100)
function encodeTextToBits(text: string, version: number, ecLevel: ErrorCorrectionLevel): Uint8Array {
  const spec = QR_SPECS.find((s) => s.version === version)!;
  const maxBytes = spec.totalDataBytes[ecLevel];

  const utf8Encoder = new TextEncoder();
  const textBytes = utf8Encoder.encode(text);

  if (textBytes.length + 3 > maxBytes) {
    throw new Error(`Data payload too large for QR Version ${version}-${ecLevel}`);
  }

  const bitArray: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitArray.push((val >> i) & 1);
    }
  }

  // 1. Mode indicator: Byte mode = 0100
  pushBits(0b0100, 4);

  // 2. Character count indicator: 8 bits for versions 1-9
  pushBits(textBytes.length, 8);

  // 3. Data bytes
  for (let i = 0; i < textBytes.length; i++) {
    pushBits(textBytes[i], 8);
  }

  // 4. Terminator (up to 4 zeroes)
  const maxBits = maxBytes * 8;
  const termLen = Math.min(4, maxBits - bitArray.length);
  pushBits(0, termLen);

  // 5. Pad to multiple of 8
  while (bitArray.length % 8 !== 0) {
    bitArray.push(0);
  }

  // 6. Pad with 0xEC and 0x11 until maxBytes
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitArray.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bit array to Uint8Array
  const result = new Uint8Array(maxBytes);
  for (let i = 0; i < maxBytes; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bitArray[i * 8 + b];
    }
    result[i] = byte;
  }

  return result;
}

// Generate the complete QR Code Matrix
export function generateQRCodeMatrix(
  text: string,
  preferredEc: ErrorCorrectionLevel = 'M'
): { matrix: boolean[][]; size: number; version: number } {
  const utf8Len = new TextEncoder().encode(text).length;

  // Find lowest version that fits the payload
  let targetSpec: QRVersionSpec | null = null;
  for (const s of QR_SPECS) {
    if (s.totalDataBytes[preferredEc] >= utf8Len + 3) {
      targetSpec = s;
      break;
    }
  }

  if (!targetSpec) {
    // Fallback to highest version with 'L' error correction if needed
    for (const s of QR_SPECS) {
      if (s.totalDataBytes['L'] >= utf8Len + 3) {
        targetSpec = s;
        preferredEc = 'L';
        break;
      }
    }
  }

  if (!targetSpec) {
    throw new Error('QR payload exceeds maximum supported capacity for district grid offline voucher.');
  }

  const { version, size } = targetSpec;
  const qr = new QRCode(size);

  // --- A. Place Finder Patterns (7x7 with 1-module separator) ---
  function placeFinder(top: number, left: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = top + r;
        const col = left + c;
        if (row >= 0 && row < size && col >= 0 && col < size) {
          const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          const isModule = (r >= 0 && r <= 6 && c >= 0 && c <= 6) && (isOuterBorder || isInnerCore);
          qr.setFunctionModule(row, col, isModule);
        }
      }
    }
  }

  placeFinder(0, 0); // Top-Left
  placeFinder(0, size - 7); // Top-Right
  placeFinder(size - 7, 0); // Bottom-Left

  // --- B. Place Timing Patterns ---
  for (let i = 8; i < size - 8; i++) {
    qr.setFunctionModule(6, i, i % 2 === 0);
    qr.setFunctionModule(i, 6, i % 2 === 0);
  }

  // --- C. Dark Module ---
  qr.setFunctionModule(size - 8, 8, true);

  // --- D. Alignment Patterns (Version >= 2) ---
  if (targetSpec.alignmentPatterns.length > 0) {
    const coords = targetSpec.alignmentPatterns;
    for (const r of coords) {
      for (const c of coords) {
        // Skip corners where finders exist
        if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 8) || (r >= size - 8 && c <= 8)) {
          continue;
        }
        // Place 5x5 alignment pattern
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2;
            const isCenter = dr === 0 && dc === 0;
            qr.setFunctionModule(r + dr, c + dc, isBorder || isCenter);
          }
        }
      }
    }
  }

  // --- E. Reserve Format Information Area ---
  for (let i = 0; i <= 8; i++) {
    if (!qr.isFunctionModule(8, i)) qr.setFunctionModule(8, i, false);
    if (!qr.isFunctionModule(i, 8)) qr.setFunctionModule(i, 8, false);
  }
  for (let i = 0; i <= 7; i++) {
    if (!qr.isFunctionModule(8, size - 1 - i)) qr.setFunctionModule(8, size - 1 - i, false);
    if (!qr.isFunctionModule(size - 1 - i, 8)) qr.setFunctionModule(size - 1 - i, 8, false);
  }

  // --- F. Error Correction & Data Interleaving ---
  const dataBytes = encodeTextToBits(text, version, preferredEc);
  const numBlocks = targetSpec.numBlocks[preferredEc];
  const ecLen = targetSpec.ecBytesPerBlock[preferredEc];

  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  const blockSize = Math.floor(dataBytes.length / numBlocks);

  for (let b = 0; b < numBlocks; b++) {
    const blockData = dataBytes.slice(b * blockSize, (b + 1) * blockSize);
    dataBlocks.push(blockData);
    ecBlocks.push(rsComputeEC(blockData, ecLen));
  }

  // Interleave data and ec codewords
  const finalCodewords: number[] = [];
  for (let i = 0; i < blockSize; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(dataBlocks[b][i]);
    }
  }
  for (let i = 0; i < ecLen; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(ecBlocks[b][i]);
    }
  }

  // Convert codewords to bitstream
  const finalBits: number[] = [];
  for (const byte of finalCodewords) {
    for (let b = 7; b >= 0; b--) {
      finalBits.push((byte >> b) & 1);
    }
  }

  // --- G. Place Data Bits in Zig-Zag Pattern with Mask Evaluation ---
  // Select mask pattern 0: (r + c) % 2 === 0 (standard, high reliability)
  const maskPattern = 0;

  let bitIdx = 0;
  let upwards = true;
  for (let c = size - 1; c > 0; c -= 2) {
    if (c === 6) c--; // Skip vertical timing column

    for (let rStep = 0; rStep < size; rStep++) {
      const r = upwards ? size - 1 - rStep : rStep;
      for (let colOffset = 0; colOffset < 2; colOffset++) {
        const col = c - colOffset;
        if (!qr.isFunctionModule(r, col)) {
          let bit = bitIdx < finalBits.length ? finalBits[bitIdx] : 0;
          bitIdx++;

          // Apply mask 0: invert if (r + col) % 2 === 0
          if ((r + col) % 2 === 0) {
            bit ^= 1;
          }
          qr.matrix[r][col] = bit === 1;
        }
      }
    }
    upwards = !upwards;
  }

  // --- H. Write Format Information (Format String) ---
  const formatWord = FORMAT_INFO_STRINGS[preferredEc][maskPattern];
  for (let i = 0; i < 15; i++) {
    const bit = ((formatWord >> i) & 1) === 1;

    // Top-left format placement
    if (i <= 5) qr.matrix[8][i] = bit;
    else if (i === 6) qr.matrix[8][7] = bit;
    else if (i === 7) qr.matrix[8][8] = bit;
    else if (i === 8) qr.matrix[7][8] = bit;
    else qr.matrix[14 - i][8] = bit;

    // Second copy placement
    if (i <= 7) qr.matrix[size - 1 - i][8] = bit;
    else qr.matrix[8][size - 15 + i] = bit;
  }

  return { matrix: qr.matrix, size, version };
}

/**
 * React Component for Rendering Mathematical QR Codes as Scalable Vector Graphics (SVG)
 */
export interface QRCodeSVGProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  ecLevel?: ErrorCorrectionLevel;
  className?: string;
  includeMargin?: boolean;
}

export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({
  value,
  size = 180,
  fgColor = '#0f172a',
  bgColor = '#ffffff',
  ecLevel = 'M',
  className = '',
  includeMargin = true,
}) => {
  const qrData = React.useMemo(() => {
    try {
      return generateQRCodeMatrix(value, ecLevel);
    } catch (err) {
      console.error('Failed to generate mathematical QR matrix:', err);
      return null;
    }
  }, [value, ecLevel]);

  if (!qrData) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-slate-100 text-slate-400 font-mono text-[10px] p-2 text-center rounded border border-slate-300"
      >
        QR Gen Error
      </div>
    );
  }

  const { matrix, size: matrixSize } = qrData;
  const margin = includeMargin ? 2 : 0;
  const totalDimension = matrixSize + margin * 2;

  // Build SVG path data for crisp performance and tiny DOM footprint
  let pathD = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        const x = c + margin;
        const y = r + margin;
        pathD += `M${x},${y}h1v1h-1z `;
      }
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalDimension} ${totalDimension}`}
      width={size}
      height={size}
      className={`shape-rendering-crispEdges ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-label={`QR Code for ${value}`}
    >
      <rect width={totalDimension} height={totalDimension} fill={bgColor} />
      <path d={pathD} fill={fgColor} />
    </svg>
  );
};
