import './tracing';
import app from './app.ts';


const PORT = process.env.PORT || 4001;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
