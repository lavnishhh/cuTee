const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('./src', {
  extensions: ['html', 'htm']
}))

app.get('/', (req, res) => {
  console.log(1)
  res.status(302).redirect('./shop')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
