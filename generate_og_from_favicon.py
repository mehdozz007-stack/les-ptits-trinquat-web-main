from PIL import Image
import os

# Dimensions OpenGraph standard: 1200x630
width, height = 1200, 630

# Créer une image de fond blanc
image = Image.new('RGB', (width, height), color=(255, 255, 255))

# Charger le favicon
favicon_path = 'public/favicon.ico'
if os.path.exists(favicon_path):
    favicon = Image.open(favicon_path)
    # Redimensionner le favicon (700x700 pour bien le voir)
    favicon.thumbnail((700, 700), Image.Resampling.LANCZOS)
    # Centrer le favicon
    favicon_x = (width - favicon.width) // 2
    favicon_y = (height - favicon.height) // 2
    # Coller avec support de la transparence si RGBA
    if favicon.mode == 'RGBA':
        image.paste(favicon, (favicon_x, favicon_y), favicon)
    else:
        image.paste(favicon, (favicon_x, favicon_y))

# Sauvegarder l'image
output_path = 'public/logoAsso-og-favicon.jpg'
image.save(output_path, quality=95)
print(f"✅ Image OpenGraph générée: {output_path}")
print(f"Dimensions: {width}x{height}px")
print(f"Favicon centré sur fond blanc")
