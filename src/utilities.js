const color_tshirt = {
    "oversized_standard": {
        "name": "Oversized",
        "colors": {
            "white": {
                "front": "assets_temp/tshirts/mockup-front-white.png",
                "back": "assets_temp/tshirts/mockup-back-white.png"
            },
            "black": {
                "front": "assets_temp/tshirts/mockup-front-black.png",
                "back": "assets_temp/tshirts/mockup-back-black.png"
            },
            "beige": {
                "front": "assets_temp/tshirts/mockup-front-beige.png",
                "back": "assets_temp/tshirts/mockup-back-beige.png"
            },
        }
    },
    "tshirt": {
        "name": "T-shirt"
    }
}

const color_map = {
    "white": "#fff",
    "black": "#000",
    "beige":"#e0d898"
}

function createElement(html){
    const element = document.createElement('div')
    element.innerHTML = html
    return element.firstChild
}