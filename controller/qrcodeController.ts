import QRCode from 'qrcode';
import fs from 'fs';

const filepath = 'uploads/qrcode.png';

const generateQRCode = async (text: string) => {
    try {
        await QRCode.toFile(filepath, text, {
            color: {
                dark: '#00F',  // Blue dots
                light: '#0000' // Transparent background
            }
        });
        console.log('QR code generated successfully');
    } catch (err) {
        console.error(err);
    }
};

export const qrcodeController = async () => {
    const text = 'Booking';
    await generateQRCode(text);
};
