const app = require('./src/app');

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`App is run on port ${port}`);
});
