import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/Auth.layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
