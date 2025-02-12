import QueryMonitor from './components/QueryMonitor';
import TestQueryPage from './components/TestQueryPage';

import { Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<QueryMonitor />} /> {/* Default page */}
        <Route path='/test-query' element={<TestQueryPage />} />
      </Routes>
    </div>
  );
}

export default App;
