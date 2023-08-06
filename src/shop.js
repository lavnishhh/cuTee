function createElement(html) {
    const element = document.createElement('div')
    element.innerHTML = html
    return element.firstElementChild
}


async function fetchProduct() {
    const response = await fetch("./products.json");

    await response.json().then((res) => {

        let genre = []
        let colors = null

        paintList(res.data, genre, colors)

        // select product genre
        document.getElementById("genre-select").addEventListener('change', function (event) {
            if (event.target.type === 'radio') {

                genre = Boolean(event.target.value)?[event.target.value]:[]
                paintList(res.data, genre, colors)
            }
        });

        //add available colors
        Object.entries(color_map).forEach(([color, hex])=>{
            document.getElementById('color-select').appendChild(
                createElement(`
                    <div>
                        <input type="radio" id="color-${color}" name="product-color" value="${color}" class="hidden peer" required>
                        <label for="color-${color}"  style="background-color:${hex}" class="block m-2 peer-checked:ring-green-500 w-5 h-5 rounded-full ring-2 ring-gray-500 hover:ring-black">                           
                        </label>
                    </div>`))
        })
        document.querySelector('#color-select input').checked = true

        // select color
        document.getElementById("color-select").addEventListener('change', function (event) {
            if (event.target.type === 'radio') {

                colors = Boolean(event.target.value)?event.target.value:null
                paintList(res.data, genre, colors)
            }
        });

    });
}

function paintList(product_data_list, product_types, preview_colors) {


    product_list.replaceChildren()
    ProductPreview.painters.map(()=>{return null})
    ProductPreview.painters = []

    product_data_list.forEach(async product_data => {

        //product type
        if (product_types.length != 0 && !product_types.every(tag => product_data.tags.includes(tag))) {
            return
        }

        if (product_types.length == 0) {
            product_type = Object.keys(product_data.variants)[0]
        }

        //color
        console.log(preview_colors)
        if (!product_data.variants[product_type].colors.includes(preview_colors)) {
            if(preview_colors!=null){
                return
            }
        }

        let color = preview_colors; 

        preview_colors_set = new Set()

        let min_tshirt = Infinity
        let max_tshirt = 0

        // calculate lowest and highest base price and get a unqiue set of all colours available
        Object.entries(product_data.variants).forEach(([variant_type, variant]) => {
            variant.colors.forEach((color) => {
                preview_colors_set.add(color)
            })
            min_tshirt = Math.min(min_tshirt, variant.base)
            max_tshirt = Math.max(max_tshirt, variant.base)
        })

        //if initial color was null, set color as first available color
        console.log(preview_colors)
        if (preview_colors == null) {
            color = preview_colors_set.values().next().value;
        }

        //calculate prices with design
        Object.keys(product_data.images).forEach((pos) => {
            min_tshirt += product_data.price[pos]
            max_tshirt += product_data.price[pos]
        })

        const product_html = createElement(`
            <div class="group relative mb-5" id="product-${product_data.id}">
                <div class="relative w-full overflow-hidden md:rounded-md bg-gray-300 md:group-hover:opacity-75">
                    <div  class="image-list pb-4 flex overflow-x-scroll flex-row snap-x snap-mandatory ">
                        <div class="p-3 w-full flex-none align-middle snap-center"><canvas  class="image-front w-full aspect-1" width="500px" height="500px"></canvas></div>
                        <div class="p-3 w-full flex-none align-middle snap-center"><canvas  class="image-back w-full aspect-1" width="500px" height="500px"></canvas></div>
                    </div>
                    <div class="color-list absolute w-full bottom-4 flex justify-center mb-1 gap-x-2">

                    </div>
                </div>
                <div class="my-4 px-2 lg:mb-0 text-sm md:text-lg flex justify-between">
                    <div>
                        <h3 class="font-medium text-gray-700">
                            <a href="#" class="product-name">
                            
                            </a>
                        </h3>
                    </div>
                    <p class="product-price font-medium text-gray-900">₹${min_tshirt}-${max_tshirt}</p>
                </div>
            </div>
            `)

        //add available colors torendered element
        color_list = product_html.querySelector('.color-list')
        for (const color of preview_colors_set) {
            color_list.appendChild(createElement(`<div style="background-color:${color_map[color]}"  class="w-5 h-5 rounded-full"></div>`))
        }

        product_list.appendChild(product_html)

        //redirect on click
        product_html.addEventListener('click', () => {
            window.location.href = `product.html?p=${product_data.id}`
        })

        product_html.querySelector('.product-name').textContent = product_data.name

        //painter for each product
        const product_painter_front = new ProductPreview(product_html.querySelector('.image-front'))
        const product_painter_back = new ProductPreview(product_html.querySelector('.image-back'))

        //paint front
        product_painter_front.setBackground(color_tshirt[product_type].colors[color].front).then(() => {
            if (product_data.images.front) {
                product_painter_front.paint(product_data.images.front, ['center'], "auto").then(() => {
                    product_painter_back.toImg(product_html.querySelector('.image-front'))
                })
            }
            else if (product_data.images.pocket) {
                product_painter_front.paint(product_data.images.pocket, ["pocket"], "auto").then(() => {
                    product_painter_back.toImg(product_html.querySelector('.image-front'))
                })
            }
            else {
                product_painter_back.toImg(product_html.querySelector('.image-front'))
            }
        })

        //paint back
        product_painter_back.setBackground(color_tshirt[product_type].colors[color].back).then(() => {
            if (product_data.images.back) {
                product_painter_back.paint(product_data.images.back, ['center'], 'auto').then(() => {
                    product_painter_back.toImg(product_html.querySelector('.image-back'))
                })
            }
            else {
            }
        })
    })
}

class ProductPreview {

    static painters = []

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        ProductPreview.painters.push(this)
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
                console.log("complete")
                // if image is to be expanded
                if (ratio == 'auto') {
                    let dw = this.canvas.width
                    let dh = this.canvas.height
                    if (x == 'pocket') {
                        dw = 150
                        dh = 150
                    }
                    const h_ratio = dw / design.width;
                    const v_ratio = dh / design.height;
                    ratio = Math.min(h_ratio, v_ratio) * 0.5;
                }

                //center image
                if (x == 'center') {
                    x = (this.canvas.width - design.width * ratio) / 2,
                        y = (this.canvas.height - design.height * ratio) / 2
                }
                if (x == 'pocket') {
                    x = 300
                    y = 150
                }
                this.ctx.drawImage(design, 0, 0, design.width, design.height,
                    x, y, design.width * ratio, design.height * ratio);
                resolve()


            } else {
                design.onload = () => {

                    // if image is to be expanded
                    if (ratio == 'auto') {
                        let dw = this.canvas.width
                        let dh = this.canvas.height
                        if (x == 'pocket') {
                            dw = 150
                            dh = 150
                        }
                        const h_ratio = dw / design.width;
                        const v_ratio = dh / design.height;
                        ratio = Math.min(h_ratio, v_ratio) * 0.5;
                    }

                    //center image
                    if (x == 'center') {
                        x = (this.canvas.width - design.width * ratio) / 2,
                            y = (this.canvas.height - design.height * ratio) / 2
                    }
                    if (x == 'pocket') {
                        x = 300
                        y = 150
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

fetchProduct()





