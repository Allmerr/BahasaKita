const messages = {
 email_address_invalid: 'Alamat email tidak dapat digunakan. Gunakan alamat email aktif yang valid.',
 email_address_not_authorized: 'Email verifikasi belum dapat dikirim ke alamat ini. Pengelola perlu mengatur layanan email pendaftaran.',
 over_email_send_rate_limit: 'Batas pengiriman email verifikasi tercapai. Tunggu beberapa saat sebelum mencoba kembali.',
 over_request_rate_limit: 'Terlalu banyak percobaan. Tunggu beberapa menit sebelum mencoba kembali.',
 email_provider_disabled: 'Pendaftaran melalui email belum tersedia. Hubungi pengelola aplikasi.',
 signup_disabled: 'Pendaftaran akun baru sedang dinonaktifkan. Hubungi pengelola aplikasi.',
 weak_password: 'Kata sandi belum memenuhi ketentuan keamanan. Gunakan kata sandi lebih panjang dengan huruf besar, huruf kecil, angka, dan simbol.',
 user_already_exists: 'Email sudah terdaftar. Silakan login atau periksa email konfirmasi Anda.',
 email_exists: 'Email sudah terdaftar. Silakan login atau periksa email konfirmasi Anda.',
 captcha_failed: 'Verifikasi keamanan belum berhasil. Hubungi pengelola untuk memeriksa formulir pendaftaran.',
 email_not_confirmed: 'Email belum dikonfirmasi. Buka tautan konfirmasi di email Anda, lalu login kembali.',
 invalid_credentials: 'Email atau kata sandi belum cocok. Periksa kembali data login Anda.',
 request_timeout: 'Koneksi melewati batas waktu. Periksa jaringan dan coba kembali.',
}

export function authErrorMessage(error, action = 'register') {
 const code = typeof error?.code === 'string' && /^[a-z0-9_]{1,80}$/.test(error.code) ? error.code : ''
 if (messages[code]) return `${messages[code]} (Kode: ${code})`
 if (error?.name === 'AuthRetryableFetchError' || error instanceof TypeError || error?.status === 0) return 'Tidak dapat terhubung ke layanan akun. Periksa koneksi internet dan coba kembali.'
 if (error?.status === 429) return 'Terlalu banyak percobaan. Tunggu beberapa menit sebelum mencoba kembali.'
 const fallback = action === 'login' ? 'Login belum berhasil. Coba kembali atau hubungi pengelola.' : 'Pendaftaran belum berhasil. Hubungi pengelola untuk memeriksa layanan pendaftaran.'
 return code ? `${fallback} (Kode: ${code})` : `${fallback}${error?.status ? ` (HTTP ${Number(error.status) || 'error'})` : ''}`
}
