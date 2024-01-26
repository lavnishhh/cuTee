class ProductPreview {

   static product_preview_fronts = []

   constructor(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      ProductPreview.product_preview_fronts.push(this)
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

const product = {
   images: {
      "front": "",
      "back": "",
      "pocket": ""
   }
}

const product_type = 'oversized_standard'
const color = 'black'
const product_preview_front = new ProductPreview(document.getElementById('canvas-front'))
const product_preview_back = new ProductPreview(document.getElementById('canvas-back'))
// product_preview_front.paint(product.images.front, ['center'], 'auto')
function paint(product_type, color, image) {
   product_preview_front.clear().then(() => {
      product_preview_front.setBackground(color_tshirt[product_type].colors[color].front).then(() => {
         if (product.images.front) {
            product_preview_front.paint(product.images.front, ['center'], 'auto')
         }
         if (product.images.pocket) {
            product_preview_front.paint(product.images.pocket, ["pocket"], 'auto')
         }
      })
   })

   product_preview_back.clear().then(() => {
      product_preview_back.setBackground(color_tshirt[product_type].colors[color].back).then(() => {
         if (product.images.back) {
            product_preview_back.paint(product.images.back, ['center'], 'auto')
         }
      })
   })
}

paint(product_type, color)
// product_preview.paint('/src/assets_temp/designs/back/tshirt-5-back.png', ['center'], 0.07)

document.querySelector('#tshirt-color-change').addEventListener('click', (e) => {
   if (e.target.getAttribute('value')) {
      paint(product_type, e.target.getAttribute('value'))
   }
})

let is_pocket = false;
document.querySelector('#pocket-design-toggle').addEventListener('click', () => {
   if (is_pocket) {
      product.images.front = product.images.pocket
      product.images.pocket = ''
      is_pocket = false;
      paint(product_type, color)
      return
   }
   product.images.pocket = product.images.front
   product.images.front = ''
   is_pocket = true;
   paint(product_type, color)
   return
})

document.querySelector('#design-front-upload').addEventListener('change', () => {
   const imageInput = document.getElementById('design-front-upload');
   const preview = document.getElementById('canvas-front');

   // Check if a file was selected
   if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();

      // Read the selected file as a data URL
      reader.onload = function (event) {
         
         const dataURL = event.target.result;
         product.images.front = dataURL
         paint(product_type, color)
         // preview.src = dataURL; // Display the image preview
      };
      reader.readAsDataURL(imageInput.files[0]);
   }
})


document.querySelector('#design-back-upload').addEventListener('change', () => {
   const imageInput = document.getElementById('design-back-upload');
   const preview = document.getElementById('canvas-back');

   // Check if a file was selected
   if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();

      // Read the selected file as a data URL
      reader.onload = function (event) {
         
         const dataURL = event.target.result;
         product.images.back = dataURL
         paint(product_type, color)
         // preview.src = dataURL; // Display the image preview
      };
      reader.readAsDataURL(imageInput.files[0]);
   }
})
