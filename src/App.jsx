
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Mainpage from "./MainPage"
function App() {
  return (
      <Routes>
      <Route path='/' element={<Mainpage />}/>
    </Routes>
  );
}

export default App;
