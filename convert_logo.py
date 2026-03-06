#!/usr/bin/env python3
"""
Convertir le logo PNG en base64 data URI et générer un fichier TypeScript
"""
import base64
import sys

logo_path = "./public/logoAsso.png"
output_file = "./cloudflare/src/lib/logoDataUri.ts"

try:
    with open(logo_path, "rb") as f:
        image_data = f.read()
    
    # Convertir en base64
    b64_data = base64.b64encode(image_data).decode('utf-8')
    
    # Créer le data URI
    data_uri = f"data:image/png;base64,{b64_data}"
    
    print(f"✅ Logo converti avec succès!")
    print(f"Taille du fichier PNG: {len(image_data)} bytes")
    print(f"Taille du data URI: {len(data_uri)} caractères")
    
    # Générer le fichier TypeScript
    ts_content = f'''// Auto-generated from convert_logo.py
// Logo converted to base64 data URI

export const LOGO_DATA_URI = "{data_uri}";
'''
    
    with open(output_file, "w") as f:
        f.write(ts_content)
    
    print(f"✅ Fichier TypeScript généré: {output_file}")
    print(f"✅ Prêt à utiliser dans le code!")
    
except FileNotFoundError as e:
    print(f"❌ Erreur: Fichier non trouvé - {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Erreur: {e}")
    sys.exit(1)

