import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UserIn4 from "./pages/UserIn4";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import Groups from "./pages/Groups";
import Friends from "./pages/Friends";
import Store from "./pages/Store";
import Memories from "./pages/Memories";
import ForgetPass from "./pages/ForgetPass";
import ChangePass from "./pages/ChangePass";
import AdminPage from "./pages/AdminPage";
import AuthLayout from "./layout/AuthLayout";
import AuthApp from "./layout/AuthApp";

function App() {
  const jwt = localStorage.getItem("jwt")
  return (
    <BrowserRouter>
      <Routes>

      <Route element={<AuthApp/>}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgetpass" element= {<ForgetPass/>}/>
      </Route>

      <Route element={<AuthLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userin4" element={<UserIn4 />} />
          <Route path="/groups" element={<Groups/>}/>
          <Route path="/store" element ={<Store/>}/>
          <Route path="/friends" element ={<Friends/>}/>
          <Route path="/memories" element ={<Memories/>}/>
          <Route path="/changepass" element ={<ChangePass/>} />
          <Route path="/admin" element = {<AdminPage/>}/>
      </Route>

          <Route paht="*" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
