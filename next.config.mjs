/** @type {import('next').NextConfig} */
const nextConfig = {
  // next/image solo carga imágenes remotas de hosts en esta lista (seguridad).
  // Permitimos Cloudinary, donde se suben las fotos de producto.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
