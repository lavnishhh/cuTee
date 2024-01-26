const color_tshirt = {
    "oversized_standard": {
        "name": "Oversized",
        "colors": {
            "white": {
                "front": "/assets_temp/tshirts/mockup-front-white.png",
                "back": "/assets_temp/tshirts/mockup-back-white.png"
            },
            "black": {
                "front": "/assets_temp/tshirts/mockup-front-black.png",
                "back": "/assets_temp/tshirts/mockup-back-black.png"
            },
            "beige": {
                "front": "/assets_temp/tshirts/mockup-front-beige.png",
                "back": "/assets_temp/tshirts/mockup-back-beige.png"
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

class Buy {
    static checkForm() {

        let invalid = 0

        console.log(document.querySelector('#modal #name'))
        const name = document.querySelector('#modal #name').value.trim()
        const email = document.querySelector('#modal #email').value.trim()
        const phone = document.querySelector('#modal #phone').value.trim()
        const pincode = document.querySelector('#modal #pincode').value.trim()
        const city = document.querySelector('#modal #city').value.trim()
        const address_1 = document.querySelector('#modal #address-line-1').value.trim()
        const address_2 = document.querySelector('#modal #address-line-2').value.trim()

        if (name == '') {
            invalid += 1
        }
        else {
        }
        if (email == '' || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase()))) {
            invalid += 1
        }
        else {
        }
        if (phone == '' || !(/^\d{10}$/.test(phone))) {
            invalid += 1
        }
        else {
        }
        if (pincode == '' || !(/^\d{6}$/.test(pincode))) {
            invalid += 1
        }
        else {
        }
        if (city == '') {
            invalid += 1
        }
        else {
        }
        if (address_1 == '') {
            invalid += 1
        }
        else {
        }
        if (invalid != 0) {
            return false
        }

        let user = LocalStorage.getStorage()
        user.details = {
            name: name,
            email: email,
            phone: phone,
            pincode: pincode,
            city: city,
            'address-line-1': address_1,
            'address-line-2': address_2
        }
        LocalStorage.setStorage(user)

        return true


    }

    static fillForm(){
        const user = LocalStorage.getStorage()
        if (user.details) {
            Object.keys(user.details).forEach((field) => {
                console.log(field)
                document.querySelector(`#modal #${field}`).value = user.details[field]
            })
        }
    }

    static copyDetails(data) {
        let copy_text = "Hi, I'm {name}, I wouuld like to buy the following\n{products}\nI can be contacted at {email} and {phone}. Here's the delivery address:{address}"
    
        console.log(data)
        let product_text = ""
        data.products.forEach(product => {
            product_text += product.data.name.padEnd(30, " ")
            product_text += product.size.padStart(5, " ")
            product_text += `\n`
        })
        copy_text = copy_text.replace('{products}', product_text)
        .replace('{name}', data.details.name)
        .replace('{email}', data.details.email)
        .replace('{phone}', data.details.phone)
        .replace('{address}', `${data.details['address-line-1']}\n${data.details['address-line-2'] ? data.details['address-line-2'] : ''}`)
        navigator.clipboard.writeText(copy_text);
    }

    static deliveryModal(products){

        console.log('adding')

        document.querySelector('#modal').innerHTML = 
                `
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="fixed inset-0 z-10 overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center md:p-4 text-center sm:items-center sm:p-0">
                        <div
                            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <form class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div class="border-b border-gray-900/10">
                                    <h2 class="text-base font-semibold leading-7 text-gray-900">Delivery Details</h2>
                                    <div class="mt-5 grid gap-x-6 gap-y-4 grid-cols-6 pb-4">
                                        <div class="col-span-6">
                                            <label for="first-name"
                                                class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                            <div class="mt-2">
                                                <input id="name" type="text" name="first-name" autocomplete="given-name"
                                                    required aria-required="true"
                                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            </div>
                                        </div>

                                        <div class="col-span-3">
                                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email
                                                address</label>
                                            <div class="mt-2">
                                                <input id="email" name="email" type="email" autocomplete="email" required
                                                    aria-required="true"
                                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            </div>
                                        </div>

                                        <div class="col-span-3">
                                            <label for="phone"
                                                class="block text-sm font-medium leading-6 text-gray-900">Phone</label>
                                            <div class="mt-2">
                                                <input id="phone" name="phone" type="phone" autocomplete="email" required
                                                    aria-required="true"
                                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            </div>
                                        </div>

                                        <div class="col-span-full">
                                            <label for="address-line-1"
                                                class="block text-sm font-medium leading-6 text-gray-900">Address line 1</label>
                                            <div class="mt-2">
                                                <input type="text" name="address-line-1" id="address-line-1"
                                                    autocomplete="address-line-1" required aria-required="true"
                                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            </div>
                                        </div>

                                        <div class="col-span-full">
                                            <label for="address-line-2"
                                                class="block text-sm font-medium leading-6 text-gray-900">Address line 2</label>
                                            <div class="mt-2">
                                                <input type="text" name="address-line-2" id="address-line-2"
                                                    autocomplete="address-line-2"
                                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            </div>
                                        </div>

                                        <div class="col-span-3 col-start-1">
                                            <label for="city"
                                                class="block text-sm font-medium leading-6 text-gray-900">City</label>
                                            <div class="mt-2">
                                                <input type="text" name="city" id="city" autocomplete="address-level2" required
                                                    aria-required="true"
                                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            </div>
                                        </div>

                                        <div class="col-span-3">
                                            <label for="pincode"
                                                class="block text-sm font-medium leading-6 text-gray-900">Pincode</label>
                                            <div class="mt-2">
                                                <input type="text" name="pincode" id="pincode" autocomplete="pincode" required
                                                    aria-required="true"
                                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button id="cart-buy" type="submit" action="/"
                                    class="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto">Continue</button>
                                <button id="cancel-cart-buy" type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
        

        document.querySelector('#cart-buy').addEventListener('click', ()=>{
            console.log("checking form")
            if(Buy.checkForm()){
                if(products){
                    const user = LocalStorage.getStorage()
                    user.products = products
                    this.copyDetails(user)
                }
            }
        })


        document.querySelector('#cancel-cart-buy').addEventListener('click', ()=>{
            document.querySelector('#modal').replaceChildren()
        })
    }

    static buy(products){
        Buy.deliveryModal(products)
        Buy.fillForm(products)
    }
}