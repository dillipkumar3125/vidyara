
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import Signup from "./pages/Signup.tsx";
import RootLayout from "./pages/RootLayout.tsx";
import Userlayout from "./pages/users/Userlayout.tsx";
import Userhome from "./pages/users/Userhome.tsx";
import Userprofile from "./pages/users/Userprofile.tsx";
import OAuthSuccess from "./pages/OAuthSuccess.tsx";
import OAuthFailure from "./pages/OAuthFailure.tsx";
import CommunityForum from "./pages/users/CommunityForum.tsx";
import Certificates from "./pages/users/Certificates.tsx";
import Vidyara from "./pages/users/Vidyara.tsx";
import KnowledgeGraph from "./pages/users/KnowledgeGraph.tsx";
import StudyMaterials from "./pages/users/StudyMaterials.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Userlayout />}>
          <Route index element={<Userhome />} />
          <Route path="profile" element={<Userprofile />} />
          <Route path="community-forum" element={<CommunityForum />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="vidyara" element={<Vidyara />} />
          <Route path="knowledge-graph" element={<KnowledgeGraph />} />
          <Route path="study-materials" element={<StudyMaterials />} />
        </Route>
        <Route path="oauth/success" element={<OAuthSuccess />} />
        <Route path="oauth/failure" element={<OAuthFailure />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
