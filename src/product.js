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
        }
    },
    "tshirt": {
        "name": "T-shirt"
    }
}

const color_map = {
    "white": "#fff",
    "black": "#000"
}

sizes = ['s', 'm', 'l', 'xl']

let product_preview;

async function fetchProduct(id) {
    const response = await fetch("./products.json");
    await response.json().then((movies) => {
        console.log(movies)
        const product_data = movies.data[id]

        document.querySelector('#product-name').textContent = product_data.name
        document.querySelector('#product-image-holder').innerHTML = `<canvas id="product-canvas" class="w-full" width="1000px" height="1000px"></canvas>`
        document.querySelector('#product-canvas').style.height = `${document.querySelector('#product-image-holder').getBoundingClientRect().width}px`

        const variants = product_data.variants

        document.querySelector('#product-type-select').replaceChildren()
        Object.entries(variants).forEach(([product_type, variant], index) => {

            // add product type select option
            document.querySelector('#product-type-select').insertAdjacentHTML(
                'beforeend',
                `
                <label for="${product_type}-select"
                    class="group relative flex items-center justify-center rounded-lg border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                    <span id="${product_type}-select-label">${color_tshirt[product_type].name}</span>
                    <!--
                        Active: "border", Not Active: "border-2"
                        Checked: "border-green-500", Not Checked: "border-transparent"
                    -->
                    <input type="radio" name="shirt-choice" value="${product_type}" class="peer sr-only"
                        id="${product_type}-select">
                    <span
                        class="pointer-events-none absolute -inset-px rounded-lg peer-checked:border-2 peer-checked:border-green-500"
                        aria-hidden="true"></span>

                </label>
                `
            )

            // check first variant
            if (index == 0) {

                product_preview = new ProductPreview('product-canvas')

                setProduct(product_type, variant)
                document.querySelector(`#${product_type}-select`).checked = true

                variant.colors.forEach(color => {
                    document.querySelector('#color-select').insertAdjacentHTML(
                        'beforeend',
                        `
                        <label
                            class="relative -m-0.5 mx-1.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none">
                            <input type="radio" name="color-choice" value="${color}" class="peer sr-only"
                                id="color-choice-${color}-label">
                            <span
                                class="ring-offset-2 peer-checked:ring-2 ring-green-500 h-8 w-8 rounded-full border border-black border-opacity-10"
                                style="background-color:${color_map[color]}"
                                aria-hidden="true"></span>
                        </label>
                        `
                    )

                    document.querySelector(`#color-choice-${color}-label`).addEventListener('change', (e) => {
                        if (e.currentTarget.checked) {
                            product_preview.clear()
                            product_preview.setBackground(color_tshirt[product_type].colors[e.currentTarget.value].front).then(()=>{
                                product_preview.paint('assets_temp/designs/back/tshirt-5-back.png', ['center'], 0.07)
                            })
                        }
                    })

                })

                // check first color
                document.querySelector('#color-select input').checked = true

            }
        });


    });


}

//TODO: implement custom print selection
function setProduct(product_type, product) {

    product_preview.setBackground(color_tshirt[product_type].colors[product.colors[0]].front).then(()=>{
        product_preview.paint('assets_temp/designs/back/tshirt-5-back.png', ['center'], 0.07)
    })


    // set size options
    document.querySelector('#size-select').replaceChildren()
    Object.entries(sizes).forEach(([index, size]) => {

        document.querySelector('#size-select').insertAdjacentHTML('beforeend',
            `
                <label
                    class="group relative flex items-center justify-center rounded-lg border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 ${product.sizes.includes(size) ? 'cursor-pointer bg-white text-gray-900 shadow-sm' : 'cursor-not-allowed bg-gray-50 text-gray-200'}">
                    <span id="size-choice-${size}-label">${size.toUpperCase()}</span>
                    <input ${product.sizes.includes(size) ? '' : 'disabled'} type="radio" name="size-choice" value="${size}" class="peer sr-only"
                        aria-labelledby="size-choice-${size}-label" id="size-choice-${size}-input">
                    <span
                        class="peer-checked:border-2 peer-checked:border-green-500 border-2 border-gray-200 pointer-events-none absolute -inset-px rounded-lg"
                        aria-hidden="true">${product.sizes.includes(size) ?
                ''
                :
                `
                            <svg class="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                                <line x1="0" y1="100" x2="100" y2="0"
                                    vector-effect="non-scaling-stroke" />
                            </svg>
                            `
            }</span>
                </label>
                `

        )

    })

    document.querySelector(`#size-choice-${product.sizes[0]}-input`).checked = true
}

class ProductPreview {

    constructor(id, background) {
        this.id = id

        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');

    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async setBackground(image) {
        return new Promise((resolve, reject) => {
            this.background = new Image();
            this.background.src = image;

            this.background.onload = () => {
                const h_ratio = this.canvas.width / this.background.width;
                const v_ratio = this.canvas.height / this.background.height;
                const ratio = Math.min(h_ratio, v_ratio);
                this.paint(this.background, ['center'], ratio);
                resolve();
            };

            this.background.onerror = (error) => {
                reject(error);
            };
        });
    }

    paint(image, [x, y], ratio) {
        let design;
        if (typeof (image) == 'string') {
            design = new Image();
            design.src = image;
        }
        else {
            design = image
        }

        if (design.complete) {
            if (x == 'center') {
                x = (this.canvas.width - design.width * ratio) / 2,
                    y = (this.canvas.height - design.height * ratio) / 2
            }
            this.ctx.drawImage(design, 0, 0, design.width, design.height,
                x, y, design.width * ratio, design.height * ratio);
        } else {
            design.onload = () => {
                if (x == 'center') {
                    x = (this.canvas.width - design.width * ratio) / 2,
                        y = (this.canvas.height - design.height * ratio) / 2
                }
                this.ctx.drawImage(design, 0, 0, design.width, design.height,
                    x, y, design.width * ratio, design.height * ratio);
            }
        }

    }

}

const url_params = new URLSearchParams(window.location.search);
const product_id = parseInt(url_params.get('p'))



fetchProduct(product_id)