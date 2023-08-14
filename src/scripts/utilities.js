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
    "t-shirt": {
        "name": "T-shirt"
    }
}

const color_map = {
    "white": "#fff",
    "black": "#000",
    "beige": "#e0d898"
}

function createElement(html) {
    const element = document.createElement('div')
    element.innerHTML = html
    return element.firstChild
}

function buy(data) {
    copy_text = "Hi, I would like I'm {name}, I wouuld like to buy the following\n{products}\nI can be contacted at {email} and {phone}. Here's the delivery address:{address}"

    console.log(data)

    let product_text = ""
    data.products.forEach(product => {
        product_text += product.data.name.padEnd(30, " ")
        product_text += product.size.padStart(5, " ")
        product_text += `\n`
    })
    copy_text = copy_text.replace('{products}', product_text)
    navigator.clipboard.writeText(copy_text);
}

class LocalStorage {
    static getStorage() {
        const storage = JSON.parse(localStorage.getItem("user"))
        if (!storage) {
            this.setStorage({
                "details": {},
                "cart": {}
            })
            return {
                "details": {},
                "cart": {}
            }
        }
        return storage
    }
    static setStorage(data) {
        localStorage.setItem("user", JSON.stringify(data))
    }
}