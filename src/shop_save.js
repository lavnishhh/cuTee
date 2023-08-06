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

function createElement(html) {
    const element = document.createElement('div')
    element.innerHTML = html
    return element.firstElementChild
}


async function fetchProduct() {
    const response = await fetch("./products.json");

    await response.json().then((res) => {

        paintList(res.data, [], [])


    });
}

function paintList(product_data_list, product_type, preview_colors) {

    product_data_list.forEach(async product_data => {

        preview_colors_set = new Set()
        color = 'white';

        if (product_type.length == 0) {
            product_type = Object.keys(product_data.variants)[0]
        }
        if (preview_colors == []) {
            Object.keys(product_data.variants).forEach(([variant, colors]) => {
                colors.forEach((color) => {
                    preview_colors_set.add(color)
                })
            })
            color = preview_colors_set.values().next().value;
        }

        const product_html = createElement(`
            <div class="group relative" id="product-${product_data.id}">
                <div class="relative w-full overflow-hidden md:rounded-md bg-gray-200 md:group-hover:opacity-75">
                    <div  class="image-list pb-4 flex overflow-x-scroll flex-row snap-x snap-mandatory ">
                    <div class="align-middle p-3 w-full flex-none snap-center items-centers">
                        <img class="image-front" width="1000px" height="1000px" src="./assets_temp/tshirts/mockup-front-black.png">
                    </div>
                    <div class="p-3 w-full flex-none snap-center">
                        <img class="image-back" width="1000px" height="1000px" src="./assets_temp/tshirts/mockup-front-black.png">
                    </div>
                    </div class="color-list">
                        <div class="color-list absolute w-full bottom-4 flex justify-center mb-1 gap-x-2">
                        <div class="w-5 h-5 bg-violet-900 rounded-full">
                    </div>
                    <div class="w-5 h-5 bg-green-500 rounded-full">

                    </div>

                    </div>
                </div>
                <div class="mt-4 px-4 flex justify-between">
                    <div>
                    <h3 class="text-sm text-gray-700">
                        <a href="#" class="product-name">
                        
                        </a>
                    </h3>
                    </div>
                    <p class="product-price text-sm font-medium text-gray-900">$35</p>
                </div>
            </div>
            `)

        product_html.querySelector('.product-name').textContent = product_data.name
        // product_html.querySelector('product-name').textContent = product_data.name

        product_list.appendChild(product_html)

        //paint front
        // console.log(product_data, product_type, color)
        promise_front = new Promise((resolve, reject) => {
            product_painter_front.clear().then(() => {
                console.log(color, "front")
                product_painter_front.setBackground(color_tshirt[product_type].colors[color].front).then(() => {
                    console.log("front done")
                    if (product_data.images.front) {
                        product_painter_front.paint(product_data.images.front, ['center'], 0.07).then(() => {
                            product_painter_back.toImg(product_html.querySelector('.image-front'))
                            resolve()
                        })
                    }
                    else if (product_data.images.pocket) {
                        product_painter_front.paint(product_data.images.pocket, [600, 350], 0.05).then(() => {
                            product_painter_back.toImg(product_html.querySelector('.image-front'))
                            resolve()
                        })
                    }
                    else {
                        product_painter_back.toImg(product_html.querySelector('.image-front'))
                        resolve()
                    }
                })
            })
        })

        promise_back = new Promise((resolve, reject) => {
            //paint back
            console.log(color, "back")
            product_painter_back.clear().then(() => {
                product_painter_back.setBackground(color_tshirt[product_type].colors[color].back).then(() => {
                    if (product_data.images.back) {
                        product_painter_back.paint(product_data.images.back, ['center'], 0.35).then(() => {
                            product_painter_back.toImg(product_html.querySelector('.image-back'))
                            resolve()
                        })
                    }
                    else {
                        resolve()
                    }
                })
            })
        })

        await Promise.all([promise_front, promise_back])
    })
}

//TODO: implement custom print selection
function setProduct(product_type, product) {

    paintProduct(product_type, product, product.variants[product_type].colors[0])

    // set size options
    document.querySelector('#size-select').replaceChildren()
    Object.entries(sizes).forEach(([index, size]) => {

        document.querySelector('#size-select').insertAdjacentHTML('beforeend',
            `
                <label
                    class="group relative flex items-center justify-center rounded-lg border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 ${product.variants[product_type].sizes.includes(size) ? 'cursor-pointer bg-white text-gray-900 shadow-sm' : 'cursor-not-allowed bg-gray-50 text-gray-200'}">
                    <span id="size-choice-${size}-label">${size.toUpperCase()}</span>
                    <input ${product.variants[product_type].sizes.includes(size) ? '' : 'disabled'} type="radio" name="size-choice" value="${size}" class="peer sr-only"
                        aria-labelledby="size-choice-${size}-label" id="size-choice-${size}-input">
                    <span
                        class="peer-checked:border-2 peer-checked:border-green-500 border-2 border-gray-200 pointer-events-none absolute -inset-px rounded-lg"
                        aria-hidden="true">${product.variants[product_type].sizes.includes(size) ?
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

    document.querySelector(`#size-choice-${product.variants[product_type].sizes[0]}-input`).checked = true
}

class ProductPreview {

    constructor(id) {
        this.id = id
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        return new Promise((resolve, reject) => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            resolve()
        })
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
        return new Promise((resolve, reject) => {
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
                resolve()

            } else {
                design.onload = () => {
                    if (x == 'center') {
                        x = (this.canvas.width - design.width * ratio) / 2,
                            y = (this.canvas.height - design.height * ratio) / 2
                    }
                    this.ctx.drawImage(design, 0, 0, design.width, design.height,
                        x, y, design.width * ratio, design.height * ratio);
                    resolve()

                }
            }
        })
    }

    toImg(element) {
        element.src = this.canvas.toDataURL()
    }

}


sizes = ['s', 'm', 'l', 'xl']

const product_list = document.querySelector('#product-list')

document.body.appendChild(createElement(`<div class="hidden w-full flex-none align-middle snap-center"><canvas id="product-painter-front" class="" width="1000px" height="1000px"></canvas></div>`))
document.body.appendChild(createElement(`<div class="hidden w-full flex-none align-middle snap-center"><canvas id="product-painter-back" class="" width="1000px" height="1000px"></canvas></div>`))

const product_painter_front = new ProductPreview('product-painter-front')
const product_painter_back = new ProductPreview('product-painter-back')

fetchProduct()