import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./routes/Home";
import Categoria from "./routes/Categoria";
import Produto from "./routes/Produto";
import Carrinho from "./routes/Carrinho";
import Favoritos from "./routes/Favoritos";
import Checkout from "./routes/Checkout";
import CompraRealizada from "./routes/CompraRealizada";
import Pedidos from "./routes/Pedidos";
import Perfil from "./routes/Perfil";
import Entrar from "./routes/Entrar";
import Privacidade from "./routes/Privacidade";
import NaoEncontrada from "./routes/NaoEncontrada";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:cat" element={<Categoria />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/finalizar-compra" element={<Checkout />} />
        <Route path="/compra-realizada" element={<CompraRealizada />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
