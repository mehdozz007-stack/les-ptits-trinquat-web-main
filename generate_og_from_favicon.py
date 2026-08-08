from PIL import Image
import os

# Dimensions OpenGraph standard: 1200x630
width, height = 1200, 630

# Charger le favicon
favicon_path = 'public/favicon.ico'
if os.path.exists(favicon_path):
    favicon = Image.open(favicon_path)
    # Convertir en RGB si nécessaire
    if favicon.mode != 'RGB':
        favicon = favicon.convert('RGB')
    # Redimensionner le favicon pour tenir dans 1200x630
    favicon.thumbnail((width, height), Image.Resampling.LANCZOS)
    # Créer image de fond blanc
    image = Image.new('RGB', (width, height), color=(255, 255, 255))
    # Centrer le favicon
    x = (width - favicon.width) // 2
    y = (height - favicon.height) // 2
    image.paste(favicon, (x, y))
else:
    print(f"❌ Fichier non trouvé: {favicon_path}")
    exit(1)

# Sauvegarder l'image
output_path = 'public/logoAsso-og-favicon.jpg'
image.save(output_path, quality=95)
print(f"✅ Image OpenGraph générée: {output_path}")
print(f"Dimensions: {width}x{height}px")
