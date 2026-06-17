# İletişim Formu — SMTP Yapılandırması

İletişim formu `nodemailer` ile SMTP üzerinden e-posta gönderir. Tüm değişkenler `.env.local` (geliştirme) veya hosting panelinde (production) tanımlanmalıdır.

## Gerekli ortam değişkenleri

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `SMTP_HOST` | SMTP sunucu adresi | `smtp.gmail.com` |
| `SMTP_PORT` | Port (`587` STARTTLS veya `465` SSL) | `587` |
| `SMTP_USER` | SMTP kullanıcı adı (genelde e-posta) | `karpolpolyurethane@gmail.com` |
| `SMTP_PASS` | SMTP şifresi veya uygulama şifresi | *(gizli)* |
| `CONTACT_TO` | Form mesajlarının gideceği adres | `karpolpolyurethane@gmail.com` |
| `CONTACT_FROM` | Gönderen başlığı (isteğe bağlı) | `Karpol İletişim <karpolpolyurethane@gmail.com>` |

`CONTACT_FROM` boş bırakılırsa `SMTP_USER` kullanılır.

## Gmail (önerilen)

Karpol hesabı Gmail kullanıyorsa:

1. Google hesabında **2 adımlı doğrulama** açık olmalı.
2. [Google Hesap → Güvenlik → Uygulama şifreleri](https://myaccount.google.com/apppasswords) bölümünden yeni şifre oluşturun (uygulama: Posta, cihaz: Diğer → “Karpol Web”).
3. `.env.local` dosyasını doldurun:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=karpolpolyurethane@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
CONTACT_TO=karpolpolyurethane@gmail.com
CONTACT_FROM=Karpol İletişim <karpolpolyurethane@gmail.com>
```

> `SMTP_PASS` içindeki boşluklar otomatik temizlenir; uygulama şifresini olduğu gibi yapıştırabilirsiniz.

## Bağlantıyı test etme

```bash
npm run contact:test
```

Başarılı çıktı: `SMTP verify OK` ve `Test email sent`.

Hata kodları:
- `SMTP_NOT_CONFIGURED` — eksik ortam değişkeni
- `EAUTH` — yanlış kullanıcı/şifre veya uygulama şifresi gerekli
- `ECONNECTION` — host/port veya ağ sorunu

## Production (Vercel vb.)

Hosting panelinde aynı değişkenleri ekleyin. `SMTP_PASS` ve `SUPABASE_SERVICE_ROLE_KEY` asla client tarafına gitmez; yalnızca sunucu ortamında kullanılır.

Deploy sonrası `/tr/contact` sayfasından test mesajı gönderin.

## Sorun giderme

| Belirti | Olası neden |
|---------|-------------|
| “İletişim servisi yapılandırılmamış” | `SMTP_*` veya `CONTACT_TO` eksik; sunucuyu yeniden başlatın |
| Gönderilemedi (500) | SMTP kimlik doğrulama hatası; uygulama şifresini kontrol edin |
| Gmail’de spam | `CONTACT_FROM` ile `SMTP_USER` aynı hesap olmalı |
| Port 465 kullanıyorsanız | `SMTP_PORT=465` — kod otomatik `secure: true` ayarlar |
