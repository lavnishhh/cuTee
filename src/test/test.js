
class ProductPreview{

   constructor(id, background){
      this.id = id
      this.canvas = document.getElementById(id);
      this.ctx = canvas.getContext('2d');

      this.setBackground(background)
   }

   setBackground(image){
      this.background = new Image()
      this.background.src = image

      const h_ratio = this.canvas.width  / this.background.width;
      const v_ratio =  this.canvas.height / this.background.height;
      const ratio  = Math.min ( h_ratio, v_ratio );
      this.paint(this.background, ['center'], ratio)
   }

   paint(image, [x, y],  ratio){
      let design;
      if(typeof(image)== 'string'){
         design = new Image();
         design.src = image;
      }
      else{
         design = image
      }

      if(x == 'center'){
         x = ( this.canvas.width - design.width*ratio ) / 2,
         y = ( this.canvas.height - design.height*ratio ) / 2
      }

      console.log(x, y)

      design.onload = () => {
         this.ctx.drawImage(design, 0,0, design.width, design.height,
                            x,y,design.width*ratio, design.height*ratio);
      };
   }

}

const product_preview = new ProductPreview('canvas', '../assets_temp/tshirts/mockup-front.png')
product_preview.paint('/src/assets_temp/designs/back/tshirt-5-back.png', ['center'], 0.07)