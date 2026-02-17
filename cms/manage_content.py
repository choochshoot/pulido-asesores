import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "content.json")


# =====================================================
# UTILIDADES
# =====================================================

def load_data():
    if not os.path.exists(DATA_PATH):
        return {
            "meta": {},
            "contact": {},
            "hero": {},
            "sections": []
        }
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("\n✔ JSON guardado correctamente en:", DATA_PATH, "\n")


def yes_no(prompt):
    return input(f"{prompt} (y/n): ").lower() == "y"

# =====================================================
# META
# =====================================================

def edit_meta(data):
    print("\n=== EDITAR META ===")
    data["meta"] = {
        "enabled": True,
        "title": input("Title SEO: "),
        "description": input("Description SEO: "),
        "url": input("URL dominio: "),
        "keywords": input("Keywords (separadas por coma): ")
    }
    save_data(data)

# =====================================================
# CONTACTO
# =====================================================

def edit_contact(data):
    print("\n=== EDITAR CONTACTO ===")
    data["contact"] = {
        "enabled": True,
        "phone": input("Teléfono: "),
        "whatsapp": input("WhatsApp sin +: "),
        "email": input("Email: "),
        "address": input("Ciudad / Dirección: "),
        "mapEmbed": input("Google Maps Embed URL: ")
    }
    save_data(data)

# =====================================================
# HERO
# =====================================================

def edit_hero(data):
    print("\n=== EDITAR HERO ===")

    hero = {
        "enabled": True,
        "background": input("URL fondo (Imgur): "),
        "logo": input("URL logo (Imgur): "),
        "title": input("Título Hero: "),
        "subtitle": input("Subtítulo Hero: "),
        "cta": {
            "enabled": yes_no("¿Activar botón CTA Hero?"),
            "text": "",
            "type": "whatsapp",
            "message": ""
        }
    }

    if hero["cta"]["enabled"]:
        hero["cta"]["text"] = input("Texto botón: ")
        hero["cta"]["message"] = input("Mensaje WhatsApp: ")

    data["hero"] = hero
    save_data(data)

# =====================================================
# SECCIONES
# =====================================================

def create_section(data):

    print("\n=== CREAR NUEVA SECCIÓN ===")

    section = {
        "enabled": True,
        "id": input("ID interno (sin espacios): "),
        "type": input("Tipo (content/services/location/etc): "),
        "title": input("Título sección: "),
        "text": input("Texto sección: "),
        "images": {
            "enabled": False,
            "autoplay": True,
            "interval": 5000,
            "fade": True,
            "dots": True,
            "items": []
        },
        "quote": {
            "enabled": False,
            "text": "",
            "author": ""
        },
        "lotties": {
            "enabled": False,
            "autoplay": True,
            "loop": False,
            "items": []
        },
        "map": {
            "enabled": False
        },
        "cta": {
            "enabled": False,
            "text": "",
            "url": ""
        }
    }

    # IMÁGENES
    if yes_no("¿Agregar carrusel de imágenes?"):
        section["images"]["enabled"] = True
        count = int(input("¿Cuántas imágenes?: "))
        for i in range(count):
            section["images"]["items"].append(
                input(f"URL imagen {i+1} (Imgur): ")
            )

    # QUOTE
    if yes_no("¿Agregar quote highlight?"):
        section["quote"]["enabled"] = True
        section["quote"]["text"] = input("Texto quote: ")
        section["quote"]["author"] = input("Autor quote: ")

    # LOTTIES
    if yes_no("¿Agregar lottie icons?"):
        section["lotties"]["enabled"] = True
        count = int(input("¿Cuántos lotties?: "))
        for i in range(count):
            section["lotties"]["items"].append(
                input(f"Ruta lottie {i+1} (ej: ./assets/lotties/file.json): ")
            )

    # MAPA
    if yes_no("¿Activar mapa en esta sección?"):
        section["map"]["enabled"] = True

    # CTA
    if yes_no("¿Agregar botón CTA en esta sección?"):
        section["cta"]["enabled"] = True
        section["cta"]["text"] = input("Texto botón: ")
        section["cta"]["url"] = input("URL botón: ")

    data["sections"].append(section)
    save_data(data)

def edit_section(data):
    if not data["sections"]:
        print("No hay secciones creadas.")
        return

    list_sections(data)

    try:
        index = int(input("Número a editar: ")) - 1
        section = data["sections"][index]
    except:
        print("Selección inválida.")
        return

    print("\n=== EDITANDO SECCIÓN ===")

    # Título
    new_title = input(f"Título ({section['title']}): ")
    if new_title:
        section["title"] = new_title

    # Texto
    new_text = input(f"Texto ({section['text']}): ")
    if new_text:
        section["text"] = new_text

    # Estado
    if yes_no("¿Cambiar estado enabled?"):
        section["enabled"] = yes_no("¿Activar sección?")

    # =============================
    # IMÁGENES
    # =============================

    if section["images"]["enabled"]:
        print("\nImágenes actuales:")
        for i, img in enumerate(section["images"]["items"]):
            print(f"{i+1}) {img}")

    if yes_no("¿Modificar carrusel de imágenes?"):
        section["images"]["enabled"] = yes_no("¿Activar carrusel?")

        if section["images"]["enabled"]:
            section["images"]["items"] = []
            count = int(input("¿Cuántas imágenes?: "))
            for i in range(count):
                section["images"]["items"].append(
                    input(f"Ruta imagen {i+1}: ")
                )

    save_data(data)
    print("✔ Sección actualizada correctamente.\n")



# =====================================================
# LISTAR
# =====================================================

def list_sections(data):
    print("\n=== SECCIONES ACTUALES ===")
    for i, s in enumerate(data["sections"]):
        print(f"{i+1}) {s['title']} (ID: {s['id']})")
    print()

# =====================================================
# ELIMINAR
# =====================================================

def delete_section(data):
    list_sections(data)
    index = int(input("Número a eliminar: ")) - 1
    if 0 <= index < len(data["sections"]):
        del data["sections"][index]
        save_data(data)

# =====================================================
# MENÚ
# =====================================================

def main():

    data = load_data()

    while True:
        print("=== PULIDO ASESORES CMS ===")
        print("1) Editar Meta SEO")
        print("2) Editar Contacto")
        print("3) Editar Hero")
        print("4) Crear Sección")
        print("5) Listar Secciones")
        print("6) Eliminar Sección")
        print("7) Editar Sección")
        print("8) Salir")


        choice = input("\nSeleccione opción: ")

        if choice == "1":
            edit_meta(data)
        elif choice == "2":
            edit_contact(data)
        elif choice == "3":
            edit_hero(data)
        elif choice == "4":
            create_section(data)
        elif choice == "5":
            list_sections(data)
        elif choice == "6":
            delete_section(data)
        elif choice == "7":
            edit_section(data)
        elif choice == "8":
            break


if __name__ == "__main__":
    main()
