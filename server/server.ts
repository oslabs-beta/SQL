import './tracing';
import app from './app.ts';

<<<<<<< HEAD
const PORT = process.env.PORT || 5000;
=======
const PORT = process.env.PORT || 4001;
>>>>>>> 09b38ee5f245a80b655ecac06af5e4c07fec2090

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
