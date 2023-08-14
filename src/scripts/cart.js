//TODO update cart


const response = await fetch("./products.json");

await response.json().then((res) => {

    let storage = LocalStorage.getStorage()
    const storage_fresh = {
        'details':storage.details,
        'cart':{}
    }

    res.data.forEach(product => {
        selected_size =  storage.cart[product].size
        selected_type =  storage.cart[product].size
    });
})