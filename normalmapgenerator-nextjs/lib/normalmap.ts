/**
 * Normal Map Generator Library
 * Based on NormalMap-Online by Christian Petry
 * Modernized for React/Next.js
 * 
 * License: MIT
 */

export interface NormalMapSettings {
    strength: number;
    level: number;
    blur: number;
    invertR: boolean;
    invertG: boolean;
    invertH: boolean;
    type: 'sobel' | 'scharr';
}

export const defaultSettings: NormalMapSettings = {
    strength: 2.5,
    level: 7,
    blur: 0,
    invertR: false,
    invertG: false,
    invertH: false,
    type: 'sobel',
};

/**
 * Generate a normal map from a height map image using CPU-based algorithm
 * This is a fallback when WebGL is not available
 */
export function generateNormalMapCPU(
    sourceImage: HTMLImageElement | HTMLCanvasElement,
    settings: NormalMapSettings = defaultSettings
): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    const width = sourceImage instanceof HTMLImageElement
        ? sourceImage.naturalWidth
        : sourceImage.width;
    const height = sourceImage instanceof HTMLImageElement
        ? sourceImage.naturalHeight
        : sourceImage.height;

    canvas.width = width;
    canvas.height = height;

    // Draw source image
    ctx.drawImage(sourceImage, 0, 0, width, height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Create output image data
    const outputData = ctx.createImageData(width, height);
    const output = outputData.data;

    // Calculate dz based on strength and level
    const dz = 1.0 / settings.strength * (1.0 + Math.pow(2.0, settings.level));

    // Invert multipliers
    const invertR = settings.invertR ? -1 : 1;
    const invertG = settings.invertG ? -1 : 1;
    const invertH = settings.invertH ? -1 : 1;

    // Process each pixel
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Get neighboring pixel heights (grayscale value)
            const getHeight = (px: number, py: number): number => {
                // Wrap around edges
                px = ((px % width) + width) % width;
                py = ((py % height) + height) % height;
                const idx = (py * width + px) * 4;
                // Convert to grayscale (use red channel or average)
                return pixels[idx] / 255.0;
            };

            const tl = getHeight(x - 1, y - 1);
            const l = getHeight(x - 1, y);
            const bl = getHeight(x - 1, y + 1);
            const t = getHeight(x, y - 1);
            const b = getHeight(x, y + 1);
            const tr = getHeight(x + 1, y - 1);
            const r = getHeight(x + 1, y);
            const br = getHeight(x + 1, y + 1);

            let dx: number, dy: number;

            if (settings.type === 'sobel') {
                // Sobel operator
                dx = tl + l * 2.0 + bl - tr - r * 2.0 - br;
                dy = tl + t * 2.0 + tr - bl - b * 2.0 - br;
            } else {
                // Scharr operator (more accurate)
                dx = tl * 3.0 + l * 10.0 + bl * 3.0 - tr * 3.0 - r * 10.0 - br * 3.0;
                dy = tl * 3.0 + t * 10.0 + tr * 3.0 - bl * 3.0 - b * 10.0 - br * 3.0;
            }

            // Apply inversions
            dx *= invertR * invertH;
            dy *= invertG * invertH;

            // Normalize
            const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const nx = dx / length;
            const ny = dy / length;
            const nz = dz / length;

            // Convert to 0-255 range (map -1,1 to 0,255)
            const idx = (y * width + x) * 4;
            output[idx] = Math.floor((nx * 0.5 + 0.5) * 255); // R
            output[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255); // G
            output[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255); // B
            output[idx + 3] = 255; // A
        }
    }

    ctx.putImageData(outputData, 0, 0);
    return canvas;
}

/**
 * Apply Gaussian blur to an image
 */
export function applyBlur(
    canvas: HTMLCanvasElement,
    radius: number
): HTMLCanvasElement {
    if (radius <= 0) return canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Use CSS filter for blur (simple approach)
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
        tempCtx.filter = `blur(${radius}px)`;
        tempCtx.drawImage(canvas, 0, 0);
        return tempCanvas;
    }

    return canvas;
}

/**
 * Read an image file and return as HTMLImageElement
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Convert canvas to blob for download
 */
export function canvasToBlob(
    canvas: HTMLCanvasElement,
    type: string = 'image/png',
    quality: number = 1.0
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
            },
            type,
            quality
        );
    });
}

/**
 * Download a canvas as an image file
 */
export async function downloadCanvas(
    canvas: HTMLCanvasElement,
    filename: string = 'normalmap.png',
    type: string = 'image/png'
): Promise<void> {
    const blob = await canvasToBlob(canvas, type);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
    img: HTMLImageElement
): { width: number; height: number } {
    return {
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
    };
}

/**
 * Check if a number is a power of 2
 */
export function isPowerOf2(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Get the next power of 2
 */
export function nextPowerOf2(n: number): number {
    let p = 1;
    while (p < n) p *= 2;
    return p;
}
