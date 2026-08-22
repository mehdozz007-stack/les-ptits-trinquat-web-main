from PIL import Image
import os

# Dimensions optimisées pour Google Search (format plus compact)
width, height = 800, 630

# Créer une image de fond blanc
image = Image.new('RGB', (width, height), color=(255, 255, 255))

# Charger le logo OG existant
logo_path = 'public/favicon.ico'  # public
if os.path.exists(logo_path):
    logo = Image.open(logo_path)
    # Redimensionner le logo pour qu'il tienne dans 700x550 max (avec peu de marges)
    # tout en gardant le ratio d'aspect
    max_width = 700
    max_height = 550
    logo.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    # Centrer le logo
    logo_x = (width - logo.width) // 2
    logo_y = (height - logo.height) // 2
    # Coller avec support de la transparence si RGBA
    if logo.mode == 'RGBA':
        image.paste(logo, (logo_x, logo_y), logo)
    else:
        image.paste(logo, (logo_x, logo_y))

# Sauvegarder l'image
output_path = 'public/favicon.jpg'
image.save(output_path, quality=95)
print(f"✅ Image OpenGraph générée: {output_path}")
print(f"Dimensions: {width}x{height}px")
print(f"Logo centré sur fond blanc")
