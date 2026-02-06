from PIL import Image, ImageDraw, ImageFont
import os

# Dimensions OpenGraph standard: 1200x630
width, height = 1200, 630

# Créer une image de fond avec gradient
image = Image.new('RGB', (width, height), color=(255, 140, 66))  # Couleur accent

# Charger le logo
logo_path = 'public/logoAsso.png'
if os.path.exists(logo_path):
    logo = Image.open(logo_path)
    # Redimensionner le logo (max 300x300)
    logo.thumbnail((300, 300), Image.Resampling.LANCZOS)
    # Centrer le logo
    logo_x = (width - logo.width) // 2
    logo_y = (height - logo.height) // 2 - 80
    image.paste(logo, (logo_x, logo_y), logo if logo.mode == 'RGBA' else None)

# Ajouter du texte
draw = ImageDraw.Draw(image)

# Essayer de charger une police système, sinon utiliser la police par défaut
try:
    title_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 72)
    subtitle_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 48)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()

# Texte
title = "Les P'tits Trinquat"
subtitle = "Association de Parents d'Élèves"

# Ajouter le titre (blanc)
title_bbox = draw.textbbox((0, 0), title, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
title_x = (width - title_width) // 2
title_y = height - 200

draw.text((title_x, title_y), title, fill=(255, 255, 255), font=title_font)

# Ajouter le sous-titre (blanc avec transparence)
subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
subtitle_x = (width - subtitle_width) // 2
subtitle_y = title_y + 90

draw.text((subtitle_x, subtitle_y), subtitle, fill=(255, 255, 255), font=subtitle_font)

# Sauvegarder l'image
output_path = 'public/logoAsso-og.jpg'
image.save(output_path, quality=95)
print(f"✅ Image OpenGraph générée: {output_path}")
print(f"Dimensions: {width}x{height}px")
