/**
 * @version 1.1.0
 * @changelog
 * - [15-04-2026] Refaktor kredensial Cloudinary menggunakan variabel environment.
 * - [15-04-2026] Penambahan penanganan error jaringan yang lebih tangguh.
 */

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Konfigurasi Cloudinary di .env belum lengkap.");
  }
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gagal mengunggah gambar ke Cloudinary.");
  }
  
  return data.secure_url;
};
