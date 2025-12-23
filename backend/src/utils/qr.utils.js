import QRCode from "qrcode";

export const generateQR = (text) => {
  return QRCode.toDataURL(text);
};
