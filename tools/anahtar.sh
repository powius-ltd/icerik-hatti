# Patron hesaplarının anahtarlarını sosyal-panel .env.local'dan okur; ekrana basılmaz. Kullanım: source tools/anahtar.sh
# Anahtarlar patronun hesaplarına ait; dosya yalnız sed ile tek satır okunur.
PANEL_ENV=/home/dev/projeler/sosyal-panel/.env.local
_env_oku() { sed -n "s/^$1=//p" "$PANEL_ENV" | head -1 | tr -d '"'"'"'\r'; }
anahtar() { _env_oku ELEVENLABS_API_KEY_AISCALE; }   # ElevenLabs (patron klon sesi)
zernio_anahtar() { _env_oku ZERNIO_API_KEY; }          # Zernio (@aiscale_app, hesap slug: varsayilan)
